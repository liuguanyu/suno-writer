import { describe, expect, it } from "vitest";
import { designAlbum } from "../src/application/design-album.js";
import type { AlbumBrief } from "../src/domain/album-brief.js";

const validBrief: AlbumBrief = {
  title: "四季行歌",
  trackCount: 4,
  genre: "Chinese Folk Pop",
  mood: "温暖诗意",
  instruments: ["古筝", "竹笛", "大提琴"],
  theme: "四季流转",
  lyricsLanguage: "中文",
  lyricsStructure: "Verse-Chorus-Bridge-Outro",
  vocalStyle: "温暖男声",
  productionNotes: "空间混响",
  trackDirections: [
    "春 — 轻柔希望",
    "夏 — 热烈奔放",
    "秋 — 深沉内省",
    "冬 — 宁静空灵",
  ],
};

describe("designAlbum", () => {
  it("应将概念展开为逐曲目规划", () => {
    const result = designAlbum(validBrief);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.plan.tracks).toHaveLength(4);
      expect(result.data.plan.tracks[0]?.theme).toBe("春 — 轻柔希望");
      expect(result.data.plan.tracks[0]?.styleDirection).toContain("Chinese Folk Pop");
      expect(result.data.plan.tracks[3]?.theme).toBe("冬 — 宁静空灵");
      // Markdown 模板应包含所有曲目槽
      expect(result.data.markdownTemplate).toContain("# 四季行歌");
      expect(result.data.markdownTemplate).toContain("## 曲目 1：[待填写歌名]");
      expect(result.data.markdownTemplate).toContain("## 曲目 4：[待填写歌名]");
    }
  });

  it("未提供 trackDirections 时应给出警告", () => {
    const noDirections: AlbumBrief = {
      ...validBrief,
      trackDirections: undefined,
    };
    const result = designAlbum(noDirections);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings).toContain("未提供 trackDirections，Agent 将自动为每首曲目规划主题");
      expect(result.data.plan.tracks[0]?.theme).toContain("待 Agent 规划");
    }
  });

  it("trackDirections 数量与 trackCount 不一致应拒绝", () => {
    const wrongCount: AlbumBrief = {
      ...validBrief,
      trackCount: 5,
      trackDirections: ["春", "夏"],
    };
    const result = designAlbum(wrongCount);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("trackDirections");
    }
  });

  it("trackCount 小于 2 应拒绝", () => {
    const result = designAlbum({ ...validBrief, trackCount: 1 });
    expect(result.ok).toBe(false);
  });

  it("曲目数超过 30 应拒绝", () => {
    const result = designAlbum({ ...validBrief, trackCount: 31 });
    expect(result.ok).toBe(false);
  });
});
