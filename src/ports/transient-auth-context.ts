/**
 * Transient Auth Context 端口 — §11.1 §12.4
 *
 * 动态认证上下文接口。只提供最小读取接口，
 * 不负责发请求、轮询或持久化。
 * 认证信息仅存在于进程内存中。
 */
export interface TransientAuthContext {
  /** 获取当前 Bearer token */
  getBearerToken(): string | null;
  /** 获取 browser-token */
  getBrowserToken(): string | null;
  /** 获取 device-id */
  getDeviceId(): string | null;
  /** 从请求头中提取并更新认证信息 */
  captureFromHeaders(headers: Record<string, string>): void;
  /** 认证信息是否有效 */
  isValid(): boolean;
  /** 清空认证信息 */
  clear(): void;
}
