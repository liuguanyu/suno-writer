import { describe, it, expect } from "vitest";
import { withRetry, DEFAULT_RETRY_OPTIONS } from "../src/shared/retry.js";

describe("withRetry", () => {
  it("首次成功不应重试", async () => {
    let attempts = 0;
    const result = await withRetry(async () => {
      attempts++;
      return "ok";
    });
    expect(result).toBe("ok");
    expect(attempts).toBe(1);
  });

  it("失败后应重试", async () => {
    let attempts = 0;
    try {
      await withRetry(
        async () => {
          attempts++;
          throw new Error("fail");
        },
        { maxRetries: 2, initialDelayMs: 1, backoffFactor: 1, maxDelayMs: 10 },
      );
    } catch {
      // 预期失败
    }
    expect(attempts).toBe(3); // 1 次初始 + 2 次重试
  });

  it("shouldRetry 返回 false 时不应重试", async () => {
    let attempts = 0;
    try {
      await withRetry(
        async () => {
          attempts++;
          throw new Error("no-retry");
        },
        {
          maxRetries: 5,
          initialDelayMs: 1,
          backoffFactor: 1,
          maxDelayMs: 10,
          shouldRetry: (err: unknown) =>
            err instanceof Error && !err.message.includes("no-retry"),
        },
      );
    } catch {
      // 预期失败
    }
    expect(attempts).toBe(1);
  });

  it("应在 maxRetries 次后成功", async () => {
    let attempts = 0;
    const result = await withRetry(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error("fail");
        return "ok";
      },
      { maxRetries: 5, initialDelayMs: 1, backoffFactor: 1, maxDelayMs: 10 },
    );
    expect(result).toBe("ok");
    expect(attempts).toBe(3);
  });
});

describe("DEFAULT_RETRY_OPTIONS", () => {
  it("应有合理的默认值", () => {
    expect(DEFAULT_RETRY_OPTIONS.maxRetries).toBeGreaterThan(0);
    expect(DEFAULT_RETRY_OPTIONS.initialDelayMs).toBeGreaterThan(0);
  });
});
