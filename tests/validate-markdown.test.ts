import { describe, it, expect } from "vitest";
import {
  validateMarkdown,
  parseMarkdown,
  serializeToMarkdown,
} from "../src/lyrics/validate-markdown.js";
import type { SongInput } from "../src/domain/song.js";

const validSong: SongInput = {
  lyrics: "[Verse 1]\n\n月下独酌",
  style: "Chamber Pop, 68 BPM",
  title: "月下独酌",
  cleanLyrics: "月下独酌",
};

const validMarkdown = `## 歌词

[Verse 1]

月下独酌

## Style

Chamber Pop, 68 BPM

## 歌名

月下独酌

## 不含技术词的歌词

月下独酌
`;

describe("validateMarkdown", () => {
  it("应正确解析完整的 Markdown", () => {
    const result = validateMarkdown(validMarkdown);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("月下独酌");
      expect(result.data.lyrics).toContain("[Verse 1]");
      expect(result.data.lyrics).toContain("月下独酌");
      expect(result.data.style).toBe("Chamber Pop, 68 BPM");
      expect(result.data.cleanLyrics).toBe("月下独酌");
    }
  });

  it("缺少部分时应返回错误", () => {
    const incomplete = `## 歌词\n\n内容\n\n## Style\n\n内容`;
    const result = validateMarkdown(incomplete);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("LYRICS_MISSING_SECTION");
      expect(result.error.message).toContain("歌名");
      expect(result.error.message).toContain("不含技术词的歌词");
    }
  });

  it("歌词超过 5000 字符应返回错误", () => {
    const longLyrics = "a".repeat(5001);
    const md = `## 歌词\n\n${longLyrics}\n\n## Style\n\nChamber Pop\n\n## 歌名\n\n月下独酌\n\n## 不含技术词的歌词\n\n月下独酌\n`;
    const result = validateMarkdown(md);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("LYRICS_TOO_LONG");
    }
  });

  it("Style 超过 1000 字符应返回错误", () => {
    const longStyle = "a".repeat(1001);
    const md = validMarkdown.replace("Chamber Pop, 68 BPM", longStyle);
    const result = validateMarkdown(md);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("STYLE_TOO_LONG");
    }
  });
});

describe("parseMarkdown", () => {
  it("应解析中文翻译部分", () => {
    const mdWithTranslation = validMarkdown + "\n## 中文翻译\n\n中文翻译内容\n";
    const result = parseMarkdown(mdWithTranslation);
    expect(result).not.toBeNull();
    expect(result?.chineseTranslation).toBe("中文翻译内容");
  });

  it("无中文翻译时应返回 undefined", () => {
    const result = parseMarkdown(validMarkdown);
    expect(result).not.toBeNull();
    expect(result?.chineseTranslation).toBeUndefined();
  });
});

describe("serializeToMarkdown", () => {
  it("应生成标准 Markdown 格式", () => {
    const md = serializeToMarkdown(validSong);
    expect(md).toContain("## 歌词");
    expect(md).toContain("## Style");
    expect(md).toContain("## 歌名");
    expect(md).toContain("## 不含技术词的歌词");
  });

  it("有中文翻译时应包含翻译部分", () => {
    const song: SongInput = { ...validSong, chineseTranslation: "翻译内容" };
    const md = serializeToMarkdown(song);
    expect(md).toContain("## 中文翻译");
    expect(md).toContain("翻译内容");
  });
});
