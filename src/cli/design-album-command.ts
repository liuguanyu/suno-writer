import { readFileSync, writeFileSync } from "node:fs";
import type { AlbumBrief } from "../domain/album-brief.js";
import { designAlbum } from "../application/design-album.js";
import { ErrorCodes } from "../domain/errors.js";
import { err, ok, type ResultEnvelope } from "../shared/result.js";
import { parseArgs } from "./index.js";

export async function runDesignAlbum(args: string[]): Promise<ResultEnvelope<unknown>> {
  const parsed = parseArgs(args);
  if (!parsed.ok) return parsed;

  const jsonPath = parsed.data.input;
  let brief: AlbumBrief;

  try {
    const raw = readFileSync(jsonPath, "utf-8");
    brief = JSON.parse(raw) as AlbumBrief;
  } catch {
    return err(ErrorCodes.FILE_NOT_FOUND, `无法读取或解析概念文件: ${jsonPath}`);
  }

  const result = designAlbum(brief);
  if (!result.ok) return result;

  // 同时将 Markdown 模板写入文件（如指定了 --output）
  const outputPath = parsed.data.options["output"];
  if (outputPath) {
    try {
      writeFileSync(outputPath, result.data.markdownTemplate, "utf-8");
    } catch {
      return err(ErrorCodes.FILE_WRITE_ERROR, `无法写入模板文件: ${outputPath}`);
    }
  }

  return ok(result.data);
}
