import { describe, it, expect } from "vitest";
import { InMemoryAuthContext } from "../src/adapters/suno-http/transient-auth.js";

describe("InMemoryAuthContext", () => {
  it("初始状态应无效", () => {
    const auth = new InMemoryAuthContext();
    expect(auth.isValid()).toBe(false);
    expect(auth.getBearerToken()).toBeNull();
    expect(auth.getBrowserToken()).toBeNull();
    expect(auth.getDeviceId()).toBeNull();
  });

  it("应从请求头提取认证信息", () => {
    const auth = new InMemoryAuthContext();
    auth.captureFromHeaders({
      Authorization: "Bearer test-token-1234567890",
      "browser-token": "browser-1234567890",
      "device-id": "device-123",
    });

    expect(auth.isValid()).toBe(true);
    expect(auth.getBearerToken()).toBe("test-token-1234567890");
    expect(auth.getBrowserToken()).toBe("browser-1234567890");
    expect(auth.getDeviceId()).toBe("device-123");
  });

  it("getHeaders 应返回认证头", () => {
    const auth = new InMemoryAuthContext();
    auth.captureFromHeaders({
      Authorization: "Bearer token1234567890",
      "device-id": "device-456",
    });

    const headers = auth.getHeaders();
    expect(headers["Authorization"]).toBe("Bearer token1234567890");
    expect(headers["device-id"]).toBe("device-456");
  });

  it("getSummary 不应暴露完整 token", () => {
    const auth = new InMemoryAuthContext();
    auth.captureFromHeaders({
      Authorization: "Bearer very-long-secret-token-1234567890",
    });

    const summary = auth.getSummary();
    expect(summary).toContain("Bearer=very-lon...");
    expect(summary).not.toContain("very-long-secret-token-1234567890");
  });

  it("clear 应清空所有认证信息", () => {
    const auth = new InMemoryAuthContext();
    auth.captureFromHeaders({
      Authorization: "Bearer token",
      "device-id": "device",
    });

    auth.clear();

    expect(auth.isValid()).toBe(false);
    expect(auth.getBearerToken()).toBeNull();
    expect(auth.getDeviceId()).toBeNull();
  });

  it("不区分大小写的请求头应能提取", () => {
    const auth = new InMemoryAuthContext();
    auth.captureFromHeaders({
      authorization: "Bearer lowercase-token",
      "Device-Id": "mixed-case",
    });

    expect(auth.getBearerToken()).toBe("lowercase-token");
    expect(auth.getDeviceId()).toBe("mixed-case");
  });
});
