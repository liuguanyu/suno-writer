import { describe, it, expect } from "vitest";
import { stripTechnicalLines } from "../src/lyrics/strip-technical-lines.js";

describe("stripTechnicalLines", () => {
  it("应去除纯标签行", () => {
    const lyrics = "[Verse 1]\n\n月下独酌\n\n[Chorus]\n\n春江花月夜";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("月下独酌\n\n春江花月夜");
      expect(result.data.removedTags).toContain("[Verse 1]");
      expect(result.data.removedTags).toContain("[Chorus]");
    }
  });

  it("混合行应去除标签保留歌词", () => {
    const lyrics = "[Verse 1] 月下独酌";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("月下独酌");
    }
  });

  it("无标签的歌词应原样返回", () => {
    const lyrics = "月下独酌\n春江花月夜";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("月下独酌\n春江花月夜");
      expect(result.data.removedTags).toHaveLength(0);
    }
  });

  it("应清理多余空行", () => {
    const lyrics = "[Verse 1]\n\n\n\n月下独酌";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("月下独酌");
    }
  });

  it("[Female]/[Male]/[Both] 角色 cue 行应提取纯歌词", () => {
    const lyrics = "[Female] 女声独唱\n[Male] 男声回应\n[Both] 同唱副歌";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("女声独唱\n男声回应\n同唱副歌");
      expect(result.data.removedTags).toEqual(["[Female]", "[Male]", "[Both]"]);
    }
  });

  it("角色 cue 与标签订阅混合行仍保留纯歌词", () => {
    const lyrics = "[Tenor/Bass] 曾追逐 天涯梦想（梦想）\n[Soprano/Alto] 梦想～";
    const result = stripTechnicalLines(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cleanLyrics).toBe("曾追逐 天涯梦想（梦想）\n梦想～");
    }
  });
});
