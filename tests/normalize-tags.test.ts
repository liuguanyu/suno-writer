import { describe, it, expect } from "vitest";
import { normalizeStrict, normalizeMinimal } from "../src/lyrics/normalize-tags.js";

describe("normalizeStrict", () => {
  it("应将圆括号技术描述转换为中括号标签", () => {
    const lyrics = "相期邈云汉。(string quartet swells)";
    const result = normalizeStrict(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.normalized).toContain("[String Quartet Swells]");
      expect(result.data.changes.length).toBeGreaterThan(0);
    }
  });

  it("应将行内标签分离到独立行", () => {
    const lyrics = "[Verse 1] 月下独酌";
    const result = normalizeStrict(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.normalized).toContain("[Verse 1]");
      expect(result.data.normalized).toContain("月下独酌");
      // 标签和歌词不在同一行
      const lines = result.data.normalized.split("\n");
      const verseLine = lines.find((l) => l.includes("[Verse 1]"));
      const lyricsLine = lines.find((l) => l.trim() === "月下独酌");
      expect(verseLine).toBeDefined();
      expect(lyricsLine).toBeDefined();
      expect(verseLine).not.toBe(lyricsLine);
    }
  });

  it("应保留行首演唱角色 cue 的逐句分配语义", () => {
    const lyrics = "[Lead vocal] 主唱这一句\n[Backing vocals] 和声回应\n[Female] 女声一句\n[Male] 男声一句\n[Both] 共同副歌";
    const result = normalizeStrict(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.normalized).toBe(lyrics);
      expect(result.data.changes).toHaveLength(0);
    }
  });

  it("应保留详细的独立制作标签", () => {
    const lyrics = "[Chorus: full SATB choir, rich harmonies, strings and flute]\n此心安处 是吾乡";
    const result = normalizeStrict(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.normalized).toBe(lyrics);
    }
  });
});

describe("normalizeMinimal", () => {
  it("应只处理行内标签", () => {
    const lyrics = "[Verse 1] 月下独酌";
    const result = normalizeMinimal(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.normalized).toContain("[Verse 1]");
      expect(result.data.normalized).toContain("月下独酌");
    }
  });
});
