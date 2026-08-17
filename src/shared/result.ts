/**
 * 结构化 JSON 信封 — 所有可执行入口的成功/失败统一契约。
 *
 * §12.4 要求每个脚本和模块使用稳定的 JSON 信封。
 */
export type ResultEnvelope<T = unknown> =
  | OkEnvelope<T>
  | ErrorEnvelope;

export interface OkEnvelope<T> {
  ok: true;
  data: T;
  warnings: string[];
}

export interface ErrorEnvelope {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  warnings: string[];
}

export function ok<T>(data: T, warnings: string[] = []): OkEnvelope<T> {
  return { ok: true, data, warnings };
}

export function err(
  code: string,
  message: string,
  warnings: string[] = [],
  details?: unknown,
): ErrorEnvelope {
  return {
    ok: false,
    error: { code, message, ...(details === undefined ? {} : { details }) },
    warnings,
  };
}
