import { describe, it, expect } from "vitest";
import { validateTags } from "../src/lyrics/validate-tags.js";

describe("validateTags", () => {
  it("规范的标签应通过校验", () => {
    const lyrics = "[Verse 1]\n\n月下独酌\n\n[Chorus]\n\n春江花月夜";
    const result = validateTags(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.valid).toBe(true);
      expect(result.data.errors).toHaveLength(0);
      expect(result.data.tagLines).toContain("[Verse 1]");
      expect(result.data.tagLines).toContain("[Chorus]");
    }
  });

  it("制作或段落标签与歌词在同一行应报错", () => {
    const lyrics = "[Verse 1] 月下独酌";
    const result = validateTags(lyrics);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TAGS_INVALID_FORMAT");
    }
  });

  it("应支持带详细制作指令的独立标签", () => {
    const lyrics = [
      "[Intro: ethereal piano and flute melody, gentle string pad, subtle nature sounds]",
      "[Vocal: clear and soothing mixed choir (SATB), with spacious reverb]",
      "[Piano Solo: 16-bar lyrical and improvisational interpolation]",
      "[8 bars: melodic development with gentle flow, reminiscent of water]",
    ].join("\n");
    const result = validateTags(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tagLines).toHaveLength(4);
    }
  });

  it("应允许行首演唱角色 cue 与歌词同行", () => {
    const lyrics = "[Tenor/Bass] 曾追逐 天涯梦想（梦想）\n[Soprano/Alto] 梦想～\n[Lead vocal] 再向前走\n[Female] 女声独唱\n[Male] 男声回应\n[Both] 同唱副歌";
    const result = validateTags(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.nonTagLines).toEqual([
        "曾追逐 天涯梦想（梦想）",
        "梦想～",
        "再向前走",
        "女声独唱",
        "男声回应",
        "同唱副歌",
      ]);
    }
  });

  it("不允许把乐器或制作指令作为行内 cue", () => {
    const result = validateTags("[Piano Solo] 月下独酌");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TAGS_INVALID_FORMAT");
    }
  });

  it("圆括号技术描述应报错", () => {
    const lyrics = "相期邈云汉。(all voices, swell)";
    const result = validateTags(lyrics);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TAGS_INVALID_FORMAT");
    }
  });

  it("空行应保留在 nonTagLines 中", () => {
    const lyrics = "[Verse 1]\n\n月下独酌";
    const result = validateTags(lyrics);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.nonTagLines).toContain("月下独酌");
    }
  });
});
