/**
 * 纯歌词提取 — §6.1 §7.1
 *
 * 从包含技术标签的歌词中提取纯演唱歌词（不含技术标签）。
 * 去除控制标签后，剩余文本应能作为纯歌词正常阅读。
 *
 * 纯函数模块：不读取环境变量、不访问网络。
 */
import { ok, type ResultEnvelope } from "../shared/result.js";

export interface StripResult {
  cleanLyrics: string;
  removedTags: string[];
}

/**
 * 从歌词文本中去除所有技术标签。
 * - 去除所有 `[Tag]` 格式的标签行
 * - 去除独立的技术控制行
 * - 保留演唱歌词行
 */
export function stripTechnicalLines(lyrics: string): ResultEnvelope<StripResult> {
  const lines = lyrics.split("\n");
  const cleanLines: string[] = [];
  const removedTags: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 空行保留
    if (trimmed.length === 0) {
      cleanLines.push("");
      continue;
    }

    // 检查是否为纯标签行
    const bracketContent = line.match(/\[[^\]]+\]/g);
    const nonBracketContent = line.replace(/\[[^\]]+\]/g, "").trim();

    if (bracketContent && bracketContent.length > 0 && nonBracketContent.length === 0) {
      // 纯标签行 — 移除，记录
      removedTags.push(trimmed);
      continue;
    }

    if (bracketContent && bracketContent.length > 0 && nonBracketContent.length > 0) {
      // 混合行 — 这种情况应该由 normalize-tags 先处理
      // 这里保守处理：去除标签部分，保留歌词
      removedTags.push(bracketContent.join(" "));
      cleanLines.push(nonBracketContent);
      continue;
    }

    // 没有标签的普通行 — 保留
    cleanLines.push(trimmed);
  }

  // 清理多余空行
  const cleanText = cleanLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return ok({ cleanLyrics: cleanText, removedTags });
}
