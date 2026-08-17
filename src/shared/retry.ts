/**
 * 通用重试策略 — §12.4 §14 §16
 *
 * 纯函数模块，不读取环境变量、不访问网络、不启动浏览器、不写文件。
 * 由调用方显式组合，不在每个适配器中复制实现。
 */

export interface RetryOptions {
  /** 最大重试次数（不包含首次尝试） */
  maxRetries: number;
  /** 初始延迟（毫秒） */
  initialDelayMs: number;
  /** 退避因子（每次重试延迟 = 上次延迟 × backoffFactor） */
  backoffFactor: number;
  /** 最大延迟上限（毫秒） */
  maxDelayMs: number;
  /** 是否允许重试的判断函数 */
  shouldRetry?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 3000,
  backoffFactor: 1.5,
  maxDelayMs: 30000,
};

/**
 * 带重试的通用执行器。
 * 首次尝试不计入 maxRetries。
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelayMs;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 检查是否允许重试
      if (opts.shouldRetry && !opts.shouldRetry(error)) {
        throw error;
      }

      // 最后一次尝试失败，不再重试
      if (attempt >= opts.maxRetries) {
        throw error;
      }

      // 等待后退避
      await sleep(delay);
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelayMs);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
