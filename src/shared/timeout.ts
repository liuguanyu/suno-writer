/**
 * 通用超时策略 — §14 §16
 *
 * 纯函数模块，不读取环境变量、不访问网络。
 * 支持 AbortSignal 组合，供 fetch 等原生 API 使用。
 */

export interface TimeoutOptions {
  /** 总超时时间（毫秒） */
  timeoutMs: number;
  /** 超时信号（与 timeoutMs 配合使用） */
  signal?: AbortSignal;
}

/**
 * 创建一个在指定毫秒后 abort 的 AbortController。
 * 可传入外部 signal，当任意一个 signal abort 时触发。
 */
export function createTimeoutSignal(timeoutMs: number, externalSignal?: AbortSignal): {
  signal: AbortSignal;
  clear: () => void;
} {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Operation timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  // 如果外部 signal 已经 abort，也触发内部的
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener("abort", () => {
        controller.abort(externalSignal.reason);
      }, { once: true });
    }
  }

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

/**
 * §14 建议的策略常量。
 */
export const PollingStrategy = {
  /** 生成状态初始轮询间隔（毫秒） */
  GENERATION_INITIAL_INTERVAL_MS: 5_000,
  /** 生成状态轮询间隔上限（毫秒） */
  GENERATION_MAX_INTERVAL_MS: 10_000,
  /** 单次歌曲生成总超时（毫秒），默认 15 分钟 */
  GENERATION_TOTAL_TIMEOUT_MS: 15 * 60 * 1_000,
  /** WAV 转换轮询间隔（毫秒） */
  WAV_POLL_INTERVAL_MS: 3_000,
  /** WAV 转换轮询间隔上限（毫秒） */
  WAV_MAX_INTERVAL_MS: 5_000,
  /** 单首 WAV 转换总超时（毫秒），默认 10 分钟 */
  WAV_TOTAL_TIMEOUT_MS: 10 * 60 * 1_000,
  /** CDN 下载超时（毫秒），默认 5 分钟 */
  CDN_DOWNLOAD_TIMEOUT_MS: 5 * 60 * 1_000,
} as const;
