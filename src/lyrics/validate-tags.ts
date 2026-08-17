/**
 * 标签校验 — §7
 *
 * 校验歌词中的技术标签是否符合规范：
 * - 使用半角中括号 []
 * - 制作/段落标签独立成行
 * - 仅演唱角色 cue 可置于歌词行首
 * - 标签使用英文
 *
 * 纯函数模块：不读取环境变量、不访问网络。
 */
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";

export interface TagValidationResult {
  valid: boolean;
  errors: TagError[];
  tagLines: string[];
  nonTagLines: string[];
}

export interface TagError {
  line: number;
  content: string;
  issue: string;
}

/**
 * 校验歌词中的所有标签。
 */
export function validateTags(lyrics: string): ResultEnvelope<TagValidationResult> {
  const lines = lyrics.split("\n");
  const errors: TagError[] = [];
  const tagLines: string[] = [];
  const nonTagLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const lineNumber = i + 1;

    // 检测行中是否有方括号标签
    const bracketContent = findBracketTags(line);

    if (bracketContent.length > 0) {
      // 有标签 — 检查是否为纯标签行
      const strippedLine = stripBracketTags(line).trim();

      if (strippedLine.length > 0) {
        if (isInlineVocalCueLine(line, bracketContent)) {
          // 行首演唱角色 cue（如 [Lead Vocal]）用于明确分配当前歌词，可以与歌词同一行。
          for (const tag of bracketContent) {
            if (!isEnglishTag(tag)) {
              errors.push({
                line: lineNumber,
                content: line.trim(),
                issue: `标签 "${tag}" 包含非英文字符，技术标签应使用英文（§7.1 规则 1）`,
              });
            }
          }
          tagLines.push(line.trim());
          nonTagLines.push(strippedLine);
        } else {
          // 制作/段落标签和演唱歌词在同一行 — 不符合规范
          errors.push({
            line: lineNumber,
            content: line.trim(),
            issue: "制作或段落标签与演唱歌词在同一行；仅行首演唱角色 cue 可内联（§7.1 规则 4）",
          });
        }
      } else {
        // 纯标签行 — 检查标签内容
        for (const tag of bracketContent) {
          if (!isEnglishTag(tag)) {
            errors.push({
              line: lineNumber,
              content: line.trim(),
              issue: `标签 "${tag}" 包含非英文字符，技术标签应使用英文（§7.1 规则 1）`,
            });
          }
        }
        tagLines.push(line.trim());
      }
    } else {
      nonTagLines.push(line.trim());
    }

    // 检查圆括号技术描述（§7.3 不规范的写法）
    if (hasParentheticalTechDesc(line)) {
      errors.push({
        line: lineNumber,
        content: line.trim(),
        issue: "检测到圆括号技术描述，应转换为独立中括号标签（§7.3）",
      });
    }
  }

  const result: TagValidationResult = {
    valid: errors.length === 0,
    errors,
    tagLines,
    nonTagLines,
  };

  if (!result.valid) {
    return err(
      ErrorCodes.TAGS_INVALID_FORMAT,
      `发现 ${errors.length} 处标签格式问题`,
    );
  }

  return ok(result);
}

/**
 * 提取行中的所有方括号标签内容（不含括号）。
 */
function findBracketTags(line: string): string[] {
  const regex = /\[([^\]]+)\]/g;
  const tags: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match[1]) {
      tags.push(match[1]);
    }
  }

  return tags;
}

/**
 * 去除行中的方括号标签。
 */
function stripBracketTags(line: string): string {
  return line.replace(/\[[^\]]+\]/g, "").trim();
}

/**
 * 行内标签只允许作为行首演唱角色 cue，用于将当前歌词明确分配给某个声部或角色。
 * 制作、结构、乐器和动态指令仍必须独立成行。
 */
export function isInlineVocalCueLine(line: string, tags = findBracketTags(line)): boolean {
  if (tags.length !== 1 || !/^\s*\[[^\]]+\]\s*\S/.test(line)) return false;

  const cue = tags[0]!.trim().toLowerCase();
  const exactCues = new Set([
    "lead", "lead vocal", "lead vocals", "backing vocal", "backing vocals",
    "male", "male vocal", "male vocals", "female", "female vocal", "female vocals",
    "both", "solo vocal",
    "soprano", "alto", "tenor", "bass", "soprano/alto", "tenor/bass",
    "choir", "full choir", "all voices", "duet", "spoken word", "whispered vocal",
  ]);

  return exactCues.has(cue)
    || /^(voice|vocal|part|character|singer)\s+[a-z0-9][a-z0-9 .'-]*$/.test(cue);
}

/**
 * 检查标签内容是否由英文字符组成。
 */
function isEnglishTag(tag: string): boolean {
  // 允许英文、数字、空格、常见标点
  return /^[a-zA-Z0-9\s.,;:!?'"()\-/&+#@%*=$<>]+$/.test(tag);
}

/**
 * 检查行中是否有圆括号技术描述（§7.3 不规范）。
 */
function hasParentheticalTechDesc(line: string): boolean {
  // 复合标签内部允许 (SATB) 等限定语；这里只检查中括号标签之外的文本。
  const textOutsideTags = line.replace(/\[[^\]]+\]/g, "");
  // 排除歌词中正常的括号内容（短且紧跟在中文后可能正常），
  // 只检测英文技术描述在圆括号中的模式。
  const parenContent = textOutsideTags.match(/\(([a-zA-Z][^)]+)\)/g);
  if (!parenContent || parenContent.length === 0) return false;

  return parenContent.some((pc) => {
    const inner = pc.slice(1, -1); // 去掉括号
    // 判断是否为技术描述：包含常见音乐术语
    const techTerms = [
      "strings", "piano", "guitar", "vocal", "voice", "choir", "swell",
      "fade", "arpeggio", "solo", "tempo", "bpm", "key", "verse", "chorus",
      "bridge", "intro", "outro", "instrumental", "harmony", "duet",
    ];
    const lower = inner.toLowerCase();
    return techTerms.some((term) => lower.includes(term));
  });
}
