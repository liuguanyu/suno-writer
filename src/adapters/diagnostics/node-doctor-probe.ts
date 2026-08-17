import { connect } from "node:net";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
  DoctorCheck,
  DoctorOptions,
  DoctorProbe,
  DoctorProbeResult,
} from "../../ports/doctor-probe.js";

const execFileAsync = promisify(execFile);
const SUNO_WEB_URL = "https://suno.com/create";
const SUNO_API_URL = "https://studio-api-prod.suno.com/api/session/";

export interface SystemProxyConfig {
  httpEnabled: boolean;
  httpHost?: string;
  httpPort?: number;
  httpsEnabled: boolean;
  httpsHost?: string;
  httpsPort?: number;
  socksEnabled: boolean;
  socksHost?: string;
  socksPort?: number;
}

interface ProxyCandidate {
  server: string;
  source: DoctorProbeResult["proxySource"];
  reason: string;
}

export function parseSystemProxy(raw: string): SystemProxyConfig {
  const value = (key: string): string | undefined => {
    const match = raw.match(new RegExp(`^\\s*${key}\\s*:\\s*(.+?)\\s*$`, "m"));
    return match?.[1];
  };
  const port = (key: string): number | undefined => {
    const rawValue = value(key);
    if (!rawValue) return undefined;
    const parsed = Number(rawValue);
    return Number.isInteger(parsed) && parsed > 0 && parsed <= 65_535 ? parsed : undefined;
  };

  return {
    httpEnabled: value("HTTPEnable") === "1",
    httpHost: value("HTTPProxy"),
    httpPort: port("HTTPPort"),
    httpsEnabled: value("HTTPSEnable") === "1",
    httpsHost: value("HTTPSProxy"),
    httpsPort: port("HTTPSPort"),
    socksEnabled: value("SOCKSEnable") === "1",
    socksHost: value("SOCKSProxy"),
    socksPort: port("SOCKSPort"),
  };
}

function proxyEndpoint(server: string): { host: string; port: number } | null {
  try {
    const url = new URL(server);
    const port = Number(url.port);
    if (!url.hostname || !Number.isInteger(port) || port < 1 || port > 65_535) return null;
    if (!["http:", "https:", "socks5:"].includes(url.protocol)) return null;
    return { host: url.hostname, port };
  } catch {
    return null;
  }
}

async function tcpReachable(host: string, port: number, timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port });
    const finish = (reachable: boolean) => {
      socket.destroy();
      resolve(reachable);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function curlStatus(url: string, proxyServer?: string): Promise<number | null> {
  const args = ["--silent", "--show-error", "--location", "--output", "/dev/null", "--write-out", "%{http_code}", "--connect-timeout", "8", "--max-time", "15"];
  if (proxyServer) args.push("--proxy", proxyServer);
  args.push(url);
  try {
    const { stdout } = await execFileAsync("curl", args, { timeout: 20_000 });
    const status = Number(stdout.trim());
    return Number.isInteger(status) && status > 0 ? status : null;
  } catch {
    return null;
  }
}

async function systemProxyCandidates(): Promise<ProxyCandidate[]> {
  if (process.platform !== "darwin") return [];
  try {
    const { stdout } = await execFileAsync("scutil", ["--proxy"], { timeout: 5000 });
    const config = parseSystemProxy(stdout);
    const candidates: ProxyCandidate[] = [];

    if (config.httpsEnabled && config.httpsHost && config.httpsPort) {
      candidates.push({
        server: `http://${config.httpsHost}:${config.httpsPort}`,
        source: "system",
        reason: "macOS HTTPS proxy",
      });
    }
    if (config.httpEnabled && config.httpHost && config.httpPort) {
      candidates.push({
        server: `http://${config.httpHost}:${config.httpPort}`,
        source: "system",
        reason: "macOS HTTP proxy",
      });
    }
    if (config.socksEnabled && config.socksHost && config.socksPort) {
      // 常见代理客户端会在 SOCKS 端口的下一端口提供 HTTP 入口；
      // HTTP 代理对 DNS 行为比 SOCKS 更稳定，故优先探测 companion。
      candidates.push({
        server: `http://${config.socksHost}:${config.socksPort + 1}`,
        source: "discovered",
        reason: "HTTP companion next to macOS SOCKS proxy",
      });
      candidates.push({
        server: `socks5://${config.socksHost}:${config.socksPort}`,
        source: "system",
        reason: "macOS SOCKS proxy",
      });
    }
    return candidates;
  } catch {
    return [];
  }
}

async function selectProxy(
  explicit?: string,
  explicitSource: "option" | "environment" = "option",
): Promise<{
  candidate?: ProxyCandidate;
  checks: DoctorCheck[];
}> {
  const checks: DoctorCheck[] = [];
  const candidates = explicit
    ? [{ server: explicit, source: explicitSource, reason: "explicit configuration" }]
    : await systemProxyCandidates();

  if (candidates.length === 0) {
    const directStatus = await curlStatus(SUNO_WEB_URL);
    if (directStatus && directStatus < 500) {
      checks.push({
        id: "proxy-config",
        status: "warning",
        required: false,
        message: "未配置代理，当前网络可直连 Suno",
        evidence: { status: directStatus },
      });
      return { checks };
    }
    checks.push({
      id: "proxy-config",
      status: "fail",
      required: true,
      message: "未发现可用代理，且当前网络无法直连 Suno",
    });
    return { checks };
  }

  for (const candidate of candidates) {
    const endpoint = proxyEndpoint(candidate.server);
    if (!endpoint) {
      checks.push({
        id: "proxy-format",
        status: "fail",
        required: true,
        message: `代理地址格式或协议无效: ${candidate.server}`,
      });
      continue;
    }
    if (!(await tcpReachable(endpoint.host, endpoint.port))) continue;
    const status = await curlStatus(SUNO_WEB_URL, candidate.server);
    if (status && status < 500) {
      checks.push({
        id: "proxy-config",
        status: "pass",
        required: true,
        message: `已选择可用代理 ${candidate.server}`,
        evidence: { source: candidate.source ?? "system", reason: candidate.reason, status },
      });
      return { candidate, checks };
    }
  }

  checks.push({
    id: "proxy-config",
    status: "fail",
    required: true,
    message: explicit ? `指定代理不可用: ${explicit}` : "系统代理已配置，但未发现可访问 Suno 的入口",
  });
  return { checks };
}

export class NodeDoctorProbe implements DoctorProbe {
  async run(options: DoctorOptions): Promise<DoctorProbeResult> {
    const checks: DoctorCheck[] = [];
    const major = Number(process.versions.node.split(".")[0]);
    checks.push({
      id: "node-version",
      status: major >= 22 ? "pass" : "fail",
      required: true,
      message: major >= 22 ? `Node.js ${process.versions.node} 满足要求` : `需要 Node.js >=22，当前为 ${process.versions.node}`,
      evidence: { version: process.versions.node },
    });

    const proxy = await selectProxy(options.proxyServer, options.proxySource);
    checks.push(...proxy.checks);
    const selectedProxy = proxy.candidate?.server;

    const webStatus = await curlStatus(SUNO_WEB_URL, selectedProxy);
    checks.push({
      id: "suno-web",
      status: webStatus && webStatus < 500 ? "pass" : "fail",
      required: true,
      message: webStatus && webStatus < 500 ? "Suno Web 可访问" : "Suno Web 不可访问",
      evidence: { status: webStatus ?? 0 },
    });
    const apiStatus = await curlStatus(SUNO_API_URL, selectedProxy);
    checks.push({
      id: "suno-api",
      status: apiStatus && apiStatus < 500 ? "pass" : "fail",
      required: true,
      message: apiStatus && apiStatus < 500 ? "Suno API 可访问" : "Suno API 不可访问",
      evidence: { status: apiStatus ?? 0 },
    });

    return {
      ...(selectedProxy ? { selectedProxy } : {}),
      proxySource: proxy.candidate?.source ?? "direct",
      checks,
    };
  }
}
