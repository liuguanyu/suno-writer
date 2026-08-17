import { validateAlbum } from "../application/validate-album.js";
import type { ResultEnvelope } from "../shared/result.js";
import { parseArgs, readInputFile } from "./index.js";

export async function runValidateAlbum(args: string[]): Promise<ResultEnvelope<unknown>> {
  const parsed = parseArgs(args);
  if (!parsed.ok) return parsed;
  const fileResult = readInputFile(parsed.data.input);
  if (!fileResult.ok) return fileResult;

  return validateAlbum({
    markdown: fileResult.data,
    normalizeMode: (parsed.data.options["mode"] as "strict" | "minimal" | undefined) ?? "strict",
  });
}
