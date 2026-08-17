/**
 * 歌词 Markdown 校验 — §6 §9
 *
 * 校验歌曲 Markdown 的四部分结构、长度限制等。
 * 纯函数模块：不读取环境变量、不访问网络、不启动浏览器、不写文件。
 */
import type { SongInput } from "../domain/song.js";
import { MARKDOWN_SECTION_ORDER } from "../domain/song.js";
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";

export interface MarkdownValidationWarnings {
  sectionOrderChanged?: boolean;
  extraSections?: string[];
}

/**
 * 从 Markdown 文本中解析出 SongInput。
 * 期望的 Markdown 格式（§6.1）：
 *
 *   ## 歌词
 *   ...
 *   ## Style
 *   ...
 *   ## 歌名
 *   ...
 *   ## 不含技术词的歌词
 *   ...
 *
 * （可选）## 中文翻译
 */
export function parseMarkdown(markdown: string): SongInput | null {
  const lyrics = extractSection(markdown, "歌词");
  const style = extractSection(markdown, "Style");
  const title = extractSection(markdown, "歌名");
  const cleanLyrics = extractSection(markdown, "不含技术词的歌词");
  const chineseTranslation = extractSection(markdown, "中文翻译");

  if (!lyrics || !style || !title || !cleanLyrics) {
    return null;
  }

  return {
    lyrics: lyrics.trim(),
    style: style.trim(),
    title: title.trim(),
    cleanLyrics: cleanLyrics.trim(),
    chineseTranslation: chineseTranslation?.trim() || undefined,
  };
}

function extractSection(markdown: string, sectionName: string): string | null {
  // 匹配 ## SectionName 到下一个 ## 标题或文件结尾
  // m 标志让 ^ 匹配行开头；用 (?![\s\S]) 代替 $ 以避免 $ 在 m 模式下匹配任意行末
  const pattern = new RegExp(
    `^##\\s+${escapeRegex(sectionName)}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|(?![\\s\\S]))`,
    "m",
  );
  const match = markdown.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 校验 Markdown 格式和内容约束。
 */
export function validateMarkdown(
  markdown: string,
): ResultEnvelope<SongInput> {
  const warnings: string[] = [];
  const song = parseMarkdown(markdown);

  if (!song) {
    // 检查缺少哪些部分
    const missing: string[] = [];
    if (!extractSection(markdown, "歌词")) missing.push("歌词");
    if (!extractSection(markdown, "Style")) missing.push("Style");
    if (!extractSection(markdown, "歌名")) missing.push("歌名");
    if (!extractSection(markdown, "不含技术词的歌词")) missing.push("不含技术词的歌词");

    return err(
      ErrorCodes.LYRICS_MISSING_SECTION,
      `缺少必要部分: ${missing.join(", ")}`,
    );
  }

  // §9: 长度限制
  if (song.lyrics.length > 5000) {
    return err(
      ErrorCodes.LYRICS_TOO_LONG,
      `歌词长度 ${song.lyrics.length} 超过 Suno 页面 5000 字符限制`,
    );
  }

  if (song.style.length > 1000) {
    return err(
      ErrorCodes.STYLE_TOO_LONG,
      `Style 长度 ${song.style.length} 超过 Suno 页面 1000 字符限制`,
    );
  }

  // 检查部分顺序（§6.1 固定顺序）
  const orderCheck = checkSectionOrder(markdown);
  if (orderCheck !== true) {
    warnings.push(`部分顺序与默认不同: ${orderCheck}`);
  }

  // 检查是否有额外部分
  const extraSections = findExtraSections(markdown);
  if (extraSections.length > 0) {
    warnings.push(`包含非标准部分: ${extraSections.join(", ")}`);
  }

  return ok(song, warnings);
}

function checkSectionOrder(markdown: string): true | string {
  const found: string[] = [];
  const sectionRegex = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    const name = match[1]?.trim();
    if (name && MARKDOWN_SECTION_ORDER.includes(name as typeof MARKDOWN_SECTION_ORDER[number])) {
      found.push(name);
    }
  }

  const expectedOrder = found.filter((s) => MARKDOWN_SECTION_ORDER.includes(s as typeof MARKDOWN_SECTION_ORDER[number]));
  const isOrdered = expectedOrder.every(
    (s, i) => s === MARKDOWN_SECTION_ORDER[i],
  );

  if (!isOrdered) {
    return `实际顺序: ${found.join(" → ")}`;
  }
  return true;
}

function findExtraSections(markdown: string): string[] {
  const knownSections = new Set([
    "歌词", "Style", "歌名", "不含技术词的歌词", "中文翻译",
  ]);
  const extras: string[] = [];
  const sectionRegex = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    const name = match[1]?.trim();
    if (name && !knownSections.has(name)) {
      extras.push(name);
    }
  }
  return extras;
}

/**
 * 将 SongInput 序列化为标准 Markdown 格式（§6.1 固定顺序）。
 */
export function serializeToMarkdown(song: SongInput): string {
  const parts = [
    `## 歌词\n\n${song.lyrics}`,
    `## Style\n\n${song.style}`,
    `## 歌名\n\n${song.title}`,
    `## 不含技术词的歌词\n\n${song.cleanLyrics}`,
  ];

  if (song.chineseTranslation) {
    parts.push(`## 中文翻译\n\n${song.chineseTranslation}`);
  }

  return parts.join("\n\n") + "\n";
}
