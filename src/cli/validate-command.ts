/**
 * validate 命令 — 校验歌曲 Markdown 并输出结构化结果。
 *
 * CLI 层：只负责解析参数、调用应用用例、输出 JSON 信封。
 * 不包含浏览器选择器、Suno URL 或 WAV 二进制解析。
 */
import { parseArgs, readInputFile } from "./index.js";
import { validateSong } from "../application/validate-song.js";
import type { ResultEnvelope } from "../shared/result.js";

export async function runValidate(args: string[]): Promise<ResultEnvelope<unknown>> {
  const parsed = parseArgs(args);
  if (!parsed.ok) return parsed;

  const fileResult = readInputFile(parsed.data.input);
  if (!fileResult.ok) return fileResult;

  const mode = (parsed.data.options["mode"] as "strict" | "minimal" | undefined) ?? "strict";

  return validateSong({
    markdown: fileResult.data,
    normalizeMode: mode,
  });
}
