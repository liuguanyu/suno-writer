import { AlbumInputSchema, type AlbumInput } from "../domain/album.js";
import { ErrorCodes } from "../domain/errors.js";
import type { NormalizeMode } from "../lyrics/normalize-tags.js";
import { validateAlbumMarkdown } from "../lyrics/validate-album-markdown.js";
import { err, ok, type ResultEnvelope } from "../shared/result.js";
import { validateSong, type ValidateSongOutput } from "./validate-song.js";

export interface ValidateAlbumInput {
  markdown?: string;
  album?: AlbumInput;
  normalizeMode?: NormalizeMode;
}

export interface ValidateAlbumOutput {
  album: AlbumInput;
  tracks: ValidateSongOutput[];
  warnings: string[];
}

export function validateAlbum(input: ValidateAlbumInput): ResultEnvelope<ValidateAlbumOutput> {
  const warnings: string[] = [];
  let album: AlbumInput;

  if (input.markdown) {
    const parseResult = validateAlbumMarkdown(input.markdown);
    if (!parseResult.ok) return parseResult;
    album = parseResult.data;
    warnings.push(...parseResult.warnings);
  } else if (input.album) {
    album = input.album;
  } else {
    return err(ErrorCodes.ALBUM_INVALID_MARKDOWN, "必须提供 markdown 或 album 参数");
  }

  const albumResult = AlbumInputSchema.safeParse(album);
  if (!albumResult.success) {
    return err(ErrorCodes.ALBUM_INVALID_MARKDOWN, `专辑数据校验失败: ${albumResult.error.message}`);
  }

  const tracks: ValidateSongOutput[] = [];
  for (let index = 0; index < albumResult.data.songs.length; index += 1) {
    const song = albumResult.data.songs[index];
    if (!song) continue;
    const result = validateSong({ song, normalizeMode: input.normalizeMode });
    if (!result.ok) {
      return err(result.error.code, `曲目 ${index + 1} 校验失败: ${result.error.message}`, warnings);
    }
    tracks.push(result.data);
    warnings.push(...result.warnings.map((warning) => `曲目 ${index + 1}: ${warning}`));
  }

  return ok({
    album: { ...albumResult.data, songs: tracks.map((track) => track.song) },
    tracks,
    warnings,
  }, warnings);
}
