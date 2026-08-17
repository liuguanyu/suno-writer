/**
 * 动态认证上下文管理 — §11.1 §12.4
 *
 * 维护进程内认证信息（Bearer token、browser-token、device-id）。
 * 只提供最小读取接口，不负责发请求、轮询或持久化。
 * 认证信息仅存在于内存中，禁止序列化、写入日志或 manifest。
 *
 * 适配器实现：纯内存组件。
 */
import type { TransientAuthContext } from "../../ports/transient-auth-context.js";

export class InMemoryAuthContext implements TransientAuthContext {
  private bearerToken: string | null = null;
  private browserToken: string | null = null;
  private deviceId: string | null = null;
  private capturedAt: Date | null = null;

  getBearerToken(): string | null {
    return this.bearerToken;
  }

  getBrowserToken(): string | null {
    return this.browserToken;
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  captureFromHeaders(headers: Record<string, string>): void {
    const normalizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      normalizedHeaders[key.toLowerCase()] = value;
    }

    const authHeader =
      normalizedHeaders["authorization"] ?? "";
    if (authHeader.startsWith("Bearer ")) {
      this.bearerToken = authHeader.slice(7);
    }

    const browserToken =
      normalizedHeaders["browser-token"] ?? "";
    if (browserToken) {
      this.browserToken = browserToken;
    }

    const deviceId =
      normalizedHeaders["device-id"] ?? "";
    if (deviceId) {
      this.deviceId = deviceId;
    }

    this.capturedAt = new Date();
  }

  /** 直接设置 token（用于 Agent → CLI 传递认证凭证）。 */
  setTokens(params: {
    bearerToken?: string | null;
    browserToken?: string | null;
    deviceId?: string | null;
  }): void {
    if (params.bearerToken !== undefined) this.bearerToken = params.bearerToken;
    if (params.browserToken !== undefined) this.browserToken = params.browserToken;
    if (params.deviceId !== undefined) this.deviceId = params.deviceId;
    if (params.bearerToken || params.browserToken || params.deviceId) {
      this.capturedAt = new Date();
    }
  }

  isValid(): boolean {
    return this.bearerToken !== null;
  }

  clear(): void {
    this.bearerToken = null;
    this.browserToken = null;
    this.deviceId = null;
    this.capturedAt = null;
  }

  /**
   * 获取认证头，用于 HTTP 请求。
   * 注意：此方法返回的对象不暴露在序列化路径中。
   */
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }
    if (this.browserToken) {
      headers["browser-token"] = this.browserToken;
    }
    if (this.deviceId) {
      headers["device-id"] = this.deviceId;
    }

    return headers;
  }

  /**
   * 获取认证信息摘要（用于日志，不包含完整 token）。
   */
  getSummary(): string {
    if (!this.isValid()) return "not authenticated";

    const parts: string[] = [];
    if (this.bearerToken) {
      parts.push(`Bearer=${this.bearerToken.slice(0, 8)}...`);
    }
    if (this.browserToken) {
      parts.push(`browser-token=${this.browserToken.slice(0, 8)}...`);
    }
    parts.push(`captured=${this.capturedAt?.toISOString() ?? "unknown"}`);
    return parts.join(", ");
  }
}
