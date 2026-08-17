import { describe, expect, it } from "vitest";
import { validateAlbum } from "../src/application/validate-album.js";
import { serializeAlbumToMarkdown } from "../src/lyrics/validate-album-markdown.js";
import type { AlbumInput } from "../src/domain/album.js";

const albumMarkdown = `# 月下诗集

三首古诗新唱。

## 曲目 1：月下独酌

### 歌词

[Verse 1]\n月下独酌

### Style

Chamber Pop

### 歌名

月下独酌

### 不含技术词的歌词

月下独酌

## 曲目 2：静夜思

### 歌词

[Verse 1]\n床前明月光

### Style

Folk Ballad

### 歌名

静夜思

### 不含技术词的歌词

床前明月光
`;

describe("validateAlbum", () => {
  it("应解析并逐曲校验专辑 Markdown", () => {
    const result = validateAlbum({ markdown: albumMarkdown });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.album.title).toBe("月下诗集");
      expect(result.data.album.description).toBe("三首古诗新唱。");
      expect(result.data.album.songs.map((song) => song.title)).toEqual(["月下独酌", "静夜思"]);
      expect(result.data.tracks).toHaveLength(2);
    }
  });

  it("少于两首曲目应拒绝", () => {
    const oneTrack = albumMarkdown.slice(0, albumMarkdown.indexOf("## 曲目 2"));
    const result = validateAlbum({ markdown: oneTrack });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("ALBUM_TOO_FEW_TRACKS");
  });

  it("曲目编号不连续应拒绝并定位", () => {
    const result = validateAlbum({ markdown: albumMarkdown.replace("## 曲目 2", "## 曲目 3") });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("位置 2 实际为曲目 3");
  });

  it("应支持序列化后重新解析", () => {
    const album: AlbumInput = {
      title: "双月",
      songs: [
        { lyrics: "[Verse 1]\n甲", style: "Pop", title: "甲", cleanLyrics: "甲" },
        { lyrics: "[Verse 1]\n乙", style: "Folk", title: "乙", cleanLyrics: "乙" },
      ],
    };
    const result = validateAlbum({ markdown: serializeAlbumToMarkdown(album) });
    expect(result.ok).toBe(true);
  });
});
