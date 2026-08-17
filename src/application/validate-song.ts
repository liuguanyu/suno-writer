/**
 * 歌曲校验用例 — §6 §7 §9
 *
 * 编排歌词模块完成从 Markdown 解析到最终校验的完整流程。
 * 不包含浏览器选择器、Suno URL 或 WAV 二进制解析。
 *
 * Application 层：组合 lyrics 模块能力。
 */
import { createHash } from "node:crypto";
import type { SongInput } from "../domain/song.js";
import { SongInputSchema } from "../domain/song.js";
import { validateMarkdown } from "../lyrics/validate-markdown.js";
import { validateTags } from "../lyrics/validate-tags.js";
import { stripTechnicalLines } from "../lyrics/strip-technical-lines.js";
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";
import type { NormalizeMode } from "../lyrics/normalize-tags.js";
import { normalizeStrict, normalizeMinimal } from "../lyrics/normalize-tags.js";

export interface ValidateSongInput {
  /** Markdown 文本或已解析的 SongInput */
  markdown?: string;
  song?: SongInput;
  /** 标签规范化模式（§7.4） */
  normalizeMode?: NormalizeMode;
}

export interface ValidateSongOutput {
  song: SongInput;
  /** 歌词的 SHA256（用于 manifest inputs.lyricsSha256） */
  lyricsSha256: string;
  /** Style 的 SHA256（用于 manifest inputs.styleSha256） */
  styleSha256: string;
  /** 校验和规范化警告 */
  warnings: string[];
}

/**
 * 完整的歌曲校验流程：
 * 1. 解析 Markdown（如提供）
 * 2. Zod schema 校验（长度等）
 * 3. 标签格式校验
 * 4. 标签规范化（如需要）
 * 5. 纯歌词提取
 * 6. SHA256 计算
 */
export function validateSong(
  input: ValidateSongInput,
): ResultEnvelope<ValidateSongOutput> {
  const warnings: string[] = [];

  // 1. 解析或直接使用 SongInput
  let song: SongInput;
  if (input.markdown) {
    const parseResult = validateMarkdown(input.markdown);
    if (!parseResult.ok) return parseResult;
    song = parseResult.data;
    warnings.push(...parseResult.warnings);
  } else if (input.song) {
    song = input.song;
  } else {
    return err(ErrorCodes.LYRICS_INVALID_MARKDOWN, "必须提供 markdown 或 song 参数");
  }

  // 2. 如果 cleanLyrics 为空或占位符，先从 lyrics 提取
  if (!song.cleanLyrics || song.cleanLyrics === "placeholder") {
    const stripResult = stripTechnicalLines(song.lyrics);
    if (stripResult.ok) {
      song = { ...song, cleanLyrics: stripResult.data.cleanLyrics };
    }
  }

  // 3. Zod schema 校验
  const schemaResult = SongInputSchema.safeParse(song);
  if (!schemaResult.success) {
    return err(
      ErrorCodes.LYRICS_INVALID_MARKDOWN,
      `歌曲数据校验失败: ${schemaResult.error.message}`,
    );
  }
  song = schemaResult.data;

  // 4. 标签格式校验
  const tagsResult = validateTags(song.lyrics);
  if (!tagsResult.ok) {
    warnings.push(tagsResult.error.message);
    warnings.push(...tagsResult.warnings);
    // 标签格式问题不是致命错误，继续处理
  } else {
    warnings.push(...tagsResult.warnings);
  }

  // 4. 标签规范化（如需要）
  if (input.normalizeMode) {
    const normalizeFn = input.normalizeMode === "strict" ? normalizeStrict : normalizeMinimal;
    const normalizeResult = normalizeFn(song.lyrics);
    if (normalizeResult.ok) {
      song = { ...song, lyrics: normalizeResult.data.normalized };
      warnings.push(
        ...normalizeResult.data.changes.map((c) => `[规范化] ${c}`),
      );
    }
  }

  // 5. 验证纯歌词（应能从带标签歌词中提取）
  const stripResult = stripTechnicalLines(song.lyrics);
  if (stripResult.ok) {
    // 优先使用已提供的 cleanLyrics，但验证是否匹配
    if (song.cleanLyrics && song.cleanLyrics !== stripResult.data.cleanLyrics) {
      warnings.push(
        "提供的纯歌词与从技术标签版提取的不一致，使用提取版本",
      );
      song = { ...song, cleanLyrics: stripResult.data.cleanLyrics };
    } else if (!song.cleanLyrics) {
      song = { ...song, cleanLyrics: stripResult.data.cleanLyrics };
    }
  }

  // 6. 计算 SHA256
  const lyricsSha256 = sha256(song.lyrics);
  const styleSha256 = sha256(song.style);

  return ok({
    song,
    lyricsSha256,
    styleSha256,
    warnings,
  });
}

function sha256(input: string): string {
  return createHash("sha256").update(input, "utf-8").digest("hex");
}
