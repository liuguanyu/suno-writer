/**
 * 标签规范化 — §7.3 §7.4
 *
 * 将用户提供的歌词中的技术标签规范化为 Suno 可识别的格式：
 * - 圆括号技术描述 → 独立中括号标签
 * - 拼音提示 → 独立控制提示
 * - 行内标签 → 独立成行
 *
 * 纯函数模块：不读取环境变量、不访问网络。
 */
import { ok, type ResultEnvelope } from "../shared/result.js";
import { isInlineVocalCueLine } from "./validate-tags.js";

export type NormalizeMode = "strict" | "minimal";

export interface NormalizeResult {
  normalized: string;
  changes: string[];
}

/**
 * 严格规范化：将所有技术描述转换为独立中括号标签。
 */
export function normalizeStrict(lyrics: string): ResultEnvelope<NormalizeResult> {
  const changes: string[] = [];
  let normalized = lyrics;

  // 1. 圆括号技术描述 → 独立中括号标签（§7.3）
  normalized = convertParentheticalToBrackets(normalized, changes);

  // 2. 拼音提示 → 独立控制提示（§7.3）
  normalized = convertPinyinHints(normalized, changes);

  // 3. 确保所有标签独立成行
  normalized = ensureTagsOnOwnLines(normalized, changes);

  // 4. 清理多余空行
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  return ok({ normalized, changes });
}

/**
 * 最小修正：只修正明显可能被唱出的技术文本或格式错误。
 */
export function normalizeMinimal(lyrics: string): ResultEnvelope<NormalizeResult> {
  const changes: string[] = [];
  let normalized = lyrics;

  // 只处理混在同一行的标签（最可能被唱出的）
  normalized = ensureTagsOnOwnLines(normalized, changes);

  // 处理拼音提示风险（§7.3）
  normalized = convertPinyinHints(normalized, changes);

  return ok({ normalized, changes });
}

function convertParentheticalToBrackets(text: string, changes: string[]): string {
  // 检测常见的圆括号技术描述模式
  const techPatterns = [
    /\(string[^)]*\)/gi,
    /\(piano[^)]*\)/gi,
    /\(guitar[^)]*\)/gi,
    /\(vocal[^)]*\)/gi,
    /\(voice[^)]*\)/gi,
    /\(choir[^)]*\)/gi,
    /\(swell[^)]*\)/gi,
    /\(fade[^)]*\)/gi,
    /\(solo[^)]*\)/gi,
    /\(instrumental[^)]*\)/gi,
    /\(harmony[^)]*\)/gi,
    /\(duet[^)]*\)/gi,
    /\(all voices[^)]*\)/gi,
  ];

  let result = text;
  for (const pattern of techPatterns) {
    result = result.replace(pattern, (match) => {
      const inner = match.slice(1, -1).trim();
      const bracketTag = `[${capitalizeWords(inner)}]`;
      changes.push(`圆括号技术描述 "${match.trim()}" → "${bracketTag}"`);
      return `\n${bracketTag}\n`;
    });
  }

  return result;
}

/** 转大写首字母 */
export function capitalizeWords(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function convertPinyinHints(text: string, changes: string[]): string {
  // 检测拼音提示模式：汉字 + (拼音)
  const pinyinRegex = /([\u4e00-\u9fff])\(([a-zA-Z]+)\)/g;
  let result = text;

  if (pinyinRegex.test(text)) {
    pinyinRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = pinyinRegex.exec(text)) !== null) {
      const char = match[1] || "";
      const pinyin = match[2] || "";
      if (char && pinyin) {
        const hint = `[Pronounce ${char} as ${pinyin}]`;
        changes.push(`拼音提示 "${char}(${pinyin})" → "${hint}"`);
      }
    }
    // 替换为无拼音版本
    result = text.replace(pinyinRegex, "$1");
    // 在歌词开头添加提示
    const hints = [...text.matchAll(pinyinRegex)].map((m) => {
      const char = m[1] || "";
      const pinyin = m[2] || "";
      return `[Pronounce ${char} as ${pinyin}]`;
    });
    if (hints.length > 0) {
      result = hints.join("\n") + "\n\n" + result;
    }
  }

  return result;
}

function ensureTagsOnOwnLines(text: string, changes: string[]): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const bracketContent = line.match(/\[[^\]]+\]/g);
    const nonBracketContent = line.replace(/\[[^\]]+\]/g, "").trim();

    if (bracketContent && bracketContent.length > 0 && nonBracketContent.length > 0) {
      if (isInlineVocalCueLine(line)) {
        // 演唱角色 cue 必须保留在歌词行首，否则会失去逐句分配语义。
        result.push(line);
        continue;
      }

      // 制作或段落标签和歌词在同一行 — 拆分
      changes.push(`行内标签分离: "${line.trim()}"`);
      // 先放标签行
      result.push(bracketContent.join(" "));
      // 再放歌词行
      result.push(nonBracketContent);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}
