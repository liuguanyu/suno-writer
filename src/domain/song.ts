/**
 * 歌曲领域类型 — §6 创作输出契约的 TypeScript 表示。
 *
 * 代表用户确认后需要提交到 Suno 的歌曲数据。
 */
export interface SongInput {
  /** §6.3: 映射到 Suno `Lyrics editor`，包含技术标签 */
  lyrics: string;
  /** §6.3: 映射到 Suno `Styles` */
  style: string;
  /** §6.3: 映射到 Suno `Song Title` */
  title: string;
  /** §6.1: 不含技术词的纯歌词，不提交到 Suno */
  cleanLyrics: string;
  /** §6.2: 非中文歌词的中文翻译（如适用），不提交到 Suno */
  chineseTranslation?: string;
}

/**
 * SongInput 的 Zod schema，用于运行时校验。
 */
import { z } from "zod";

export const SongInputSchema = z.object({
  lyrics: z.string().min(1, "歌词不能为空").max(5000, "歌词超过 Suno 页面 5000 字符限制"),
  style: z.string().min(1, "Style 不能为空").max(1000, "Style 超过 Suno 页面 1000 字符限制"),
  title: z.string().max(200, "歌名过长"),
  cleanLyrics: z.string().min(1, "不含技术词的歌词不能为空"),
  chineseTranslation: z.string().optional(),
});

/**
 * Markdown 四部分的顺序（§6.1 固定顺序）。
 */
export const MARKDOWN_SECTION_ORDER = [
  "歌词",
  "Style",
  "歌名",
  "不含技术词的歌词",
] as const;

export type MarkdownSection = (typeof MARKDOWN_SECTION_ORDER)[number];
