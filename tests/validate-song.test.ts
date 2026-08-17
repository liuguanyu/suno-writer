import { describe, it, expect } from "vitest";
import { validateSong } from "../src/application/validate-song.js";
import type { SongInput } from "../src/domain/song.js";

const validSong: SongInput = {
  lyrics: "[Verse 1]\n\n月下独酌\n\n[Chorus]\n\n春江花月夜",
  style: "Chamber Pop, 68 BPM, A minor",
  title: "月下独酌",
  cleanLyrics: "月下独酌\n\n春江花月夜",
};

describe("validateSong", () => {
  it("应校验合法 SongInput 并计算 SHA256", () => {
    const result = validateSong({ song: validSong });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.song.title).toBe("月下独酌");
      expect(result.data.lyricsSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.data.styleSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("应从 Markdown 解析并校验", () => {
    const markdown = `## 歌词\n\n[Verse 1]\n\n月下独酌\n\n## Style\n\nChamber Pop\n\n## 歌名\n\n月下独酌\n\n## 不含技术词的歌词\n\n月下独酌\n`;
    const result = validateSong({ markdown });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.song.title).toBe("月下独酌");
    }
  });

  it("无 markdown 和 song 应返回错误", () => {
    const result = validateSong({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("LYRICS_INVALID_MARKDOWN");
    }
  });

  it("标签规范化模式应生效", () => {
    const songWithInlineTag: SongInput = {
      ...validSong,
      lyrics: "[Verse 1] 月下独酌",
    };
    const result = validateSong({
      song: songWithInlineTag,
      normalizeMode: "strict",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      // 应有规范化警告
      expect(result.data.warnings.length).toBeGreaterThan(0);
    }
  });

  it("应自动提取纯歌词", () => {
    const songWithoutClean: SongInput = {
      lyrics: "[Verse 1]\n\n月下独酌",
      style: "Chamber Pop",
      title: "月下独酌",
      cleanLyrics: "placeholder",
    };
    const result = validateSong({ song: songWithoutClean });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.song.cleanLyrics).toBe("月下独酌");
    }
  });
});
