import { describe, it, expect } from "vitest";
import {
  createTimeoutSignal,
  PollingStrategy,
} from "../src/shared/timeout.js";

describe("createTimeoutSignal", () => {
  it("应在指定毫秒后触发 abort", async () => {
    const { signal, clear } = createTimeoutSignal(50);

    expect(signal.aborted).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(signal.aborted).toBe(true);
    clear();
  });

  it("clear 应取消超时", async () => {
    const { signal, clear } = createTimeoutSignal(50);
    clear();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(signal.aborted).toBe(false);
  });

  it("外部 signal 已 abort 时应立即触发", () => {
    const controller = new AbortController();
    controller.abort(new Error("external"));

    const { signal } = createTimeoutSignal(1000, controller.signal);
    expect(signal.aborted).toBe(true);
  });
});

describe("PollingStrategy", () => {
  it("应有合理的默认值", () => {
    expect(PollingStrategy.GENERATION_INITIAL_INTERVAL_MS).toBeGreaterThan(0);
    expect(PollingStrategy.GENERATION_TOTAL_TIMEOUT_MS).toBeGreaterThan(0);
    expect(PollingStrategy.WAV_POLL_INTERVAL_MS).toBeGreaterThan(0);
    expect(PollingStrategy.WAV_TOTAL_TIMEOUT_MS).toBeGreaterThan(0);
    expect(PollingStrategy.CDN_DOWNLOAD_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it("生成总超时应为 15 分钟", () => {
    expect(PollingStrategy.GENERATION_TOTAL_TIMEOUT_MS).toBe(15 * 60 * 1000);
  });

  it("WAV 转换总超时应为 10 分钟", () => {
    expect(PollingStrategy.WAV_TOTAL_TIMEOUT_MS).toBe(10 * 60 * 1000);
  });
});
