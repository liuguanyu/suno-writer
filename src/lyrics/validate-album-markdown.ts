import type { AlbumInput } from "../domain/album.js";
import type { SongInput } from "../domain/song.js";
import { ErrorCodes } from "../domain/errors.js";
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { serializeToMarkdown, validateMarkdown } from "./validate-markdown.js";

const TRACK_HEADING_SOURCE = "^##\\s+曲目\\s+(\\d+)(?:\\s*[:：-]\\s*(.*))?\\s*$";

interface TrackSection {
  number: number;
  headingTitle?: string;
  content: string;
}

/** 解析并校验一份包含两首及以上曲目的专辑 Markdown。 */
export function validateAlbumMarkdown(markdown: string): ResultEnvelope<AlbumInput> {
  const albumTitle = extractAlbumTitle(markdown);
  if (!albumTitle) {
    return err(ErrorCodes.ALBUM_INVALID_MARKDOWN, "缺少专辑名，请使用一级标题 `# 专辑名`");
  }

  const tracks = splitTracks(markdown);
  if (tracks.length < 2) {
    return err(ErrorCodes.ALBUM_TOO_FEW_TRACKS, "专辑至少需要两个 `## 曲目 N` 部分");
  }

  const warnings: string[] = [];
  const songs: SongInput[] = [];
  for (let index = 0; index < tracks.length; index += 1) {
    const track = tracks[index];
    if (!track) continue;

    const expectedNumber = index + 1;
    if (track.number !== expectedNumber) {
      return err(
        ErrorCodes.ALBUM_INVALID_MARKDOWN,
        `曲目编号必须从 1 连续递增，位置 ${expectedNumber} 实际为曲目 ${track.number}`,
      );
    }

    const songMarkdown = track.content.replace(/^###\s+/gm, "## ");
    const songResult = validateMarkdown(songMarkdown);
    if (!songResult.ok) {
      return err(
        songResult.error.code,
        `曲目 ${track.number} 校验失败: ${songResult.error.message}`,
        warnings,
      );
    }

    if (track.headingTitle && track.headingTitle !== songResult.data.title) {
      warnings.push(
        `曲目 ${track.number} 标题“${track.headingTitle}”与歌名“${songResult.data.title}”不一致，以歌名为准`,
      );
    }
    warnings.push(...songResult.warnings.map((warning) => `曲目 ${track.number}: ${warning}`));
    songs.push(songResult.data);
  }

  return ok({
    title: albumTitle,
    description: extractDescription(markdown),
    songs,
  }, warnings);
}

export function serializeAlbumToMarkdown(album: AlbumInput): string {
  const intro = [`# ${album.title}`];
  if (album.description) intro.push(album.description);

  const tracks = album.songs.map((song, index) => {
    const songMarkdown = serializeToMarkdown(song).trim().replace(/^##\s+/gm, "### ");
    return `## 曲目 ${index + 1}：${song.title}\n\n${songMarkdown}`;
  });

  return `${[...intro, ...tracks].join("\n\n")}\n`;
}

function extractAlbumTitle(markdown: string): string | null {
  return markdown.match(/^#\s+(?!#)(.+)$/m)?.[1]?.trim() || null;
}

function extractDescription(markdown: string): string | undefined {
  const titleMatch = /^#\s+(?!#).+$/m.exec(markdown);
  const firstTrack = new RegExp(TRACK_HEADING_SOURCE, "m").exec(markdown);
  if (!titleMatch || !firstTrack) return undefined;

  const start = titleMatch.index + titleMatch[0].length;
  const description = markdown.slice(start, firstTrack.index).trim();
  return description || undefined;
}

function splitTracks(markdown: string): TrackSection[] {
  const regex = new RegExp(TRACK_HEADING_SOURCE, "gm");
  const matches = [...markdown.matchAll(regex)];

  return matches.map((match, index) => ({
    number: Number(match[1]),
    headingTitle: match[2]?.trim() || undefined,
    content: markdown.slice(
      (match.index ?? 0) + match[0].length,
      matches[index + 1]?.index ?? markdown.length,
    ).trim(),
  }));
}
