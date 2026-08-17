import { describe, expect, it } from "vitest";
import { runDoctor } from "../src/application/run-doctor.js";
import { parseSystemProxy } from "../src/adapters/diagnostics/node-doctor-probe.js";
import { ErrorCodes } from "../src/domain/errors.js";
import type { DoctorProbe } from "../src/ports/doctor-probe.js";
import { parseArgs } from "../src/cli/index.js";

function args(...values: string[]): string[] {
  return ["node", "suno-writer", ...values];
}

describe("doctor CLI 参数", () => {
  it("doctor 无需位置参数且可解析 options", () => {
    const result = parseArgs(args(
      "doctor",
      "--user-data-dir=/tmp/profile",
      "--proxy=http://127.0.0.1:1087",
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.input).toBe("");
      expect(result.data.options).toEqual({
        "user-data-dir": "/tmp/profile",
        proxy: "http://127.0.0.1:1087",
      });
    }
  });

  it("原有输入型命令仍要求 input", () => {
    const result = parseArgs(args("validate", "--mode=strict"));
    expect(result.ok).toBe(false);
  });

  it("option 中的等号不会丢失", () => {
    const result = parseArgs(args("doctor", "--proxy=http://user=a@127.0.0.1:8080"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.options.proxy).toBe("http://user=a@127.0.0.1:8080");
  });
});

describe("macOS 系统代理解析", () => {
  it("解析 HTTP、HTTPS 和 SOCKS 配置", () => {
    const config = parseSystemProxy(`
<dictionary> {
  HTTPEnable : 1
  HTTPPort : 7890
  HTTPProxy : 127.0.0.1
  HTTPSEnable : 1
  HTTPSPort : 7890
  HTTPSProxy : 127.0.0.1
  SOCKSEnable : 1
  SOCKSPort : 1086
  SOCKSProxy : 127.0.0.1
}
`);
    expect(config).toEqual({
      httpEnabled: true,
      httpHost: "127.0.0.1",
      httpPort: 7890,
      httpsEnabled: true,
      httpsHost: "127.0.0.1",
      httpsPort: 7890,
      socksEnabled: true,
      socksHost: "127.0.0.1",
      socksPort: 1086,
    });
  });
});

describe("runDoctor", () => {
  it("所有必需检查通过时 safeToSubmit=true", async () => {
    const probe: DoctorProbe = {
      async run() {
        return {
          selectedProxy: "http://127.0.0.1:1087",
          proxySource: "system",
          checks: [
            { id: "proxy-config", status: "pass", required: true, message: "ok" },
            { id: "optional", status: "warning", required: false, message: "warning" },
          ],
        };
      },
    };
    const result = await runDoctor({ probe });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.safeToSubmit).toBe(true);
      expect(result.data.selectedProxy).toBe("http://127.0.0.1:1087");
      expect(result.warnings).toEqual(["optional: warning"]);
    }
  });

  it("必需检查失败时返回完整结构化报告", async () => {
    const probe: DoctorProbe = {
      async run() {
        return {
          checks: [
            { id: "proxy-config", status: "fail", required: true, message: "代理不可用" },
            { id: "profile-lock", status: "fail", required: true, message: "Profile 已锁定" },
          ],
        };
      },
    };
    const result = await runDoctor({ probe });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(ErrorCodes.DOCTOR_CHECK_FAILED);
      const details = result.error.details as { safeToSubmit: boolean; checks: unknown[] };
      expect(details.safeToSubmit).toBe(false);
      expect(details.checks).toHaveLength(2);
    }
  });

  it("探针异常转换为 INTERNAL_ERROR", async () => {
    const probe: DoctorProbe = {
      async run() {
        throw new Error("boom");
      },
    };
    const result = await runDoctor({ probe });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(ErrorCodes.INTERNAL_ERROR);
  });
});
