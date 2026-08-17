import { z } from "zod";
import { SongInputSchema, type SongInput } from "./song.js";

/** 一张专辑及其按顺序排列的曲目。 */
export interface AlbumInput {
  title: string;
  description?: string;
  songs: SongInput[];
}

export const AlbumInputSchema = z.object({
  title: z.string().min(1, "专辑名不能为空").max(200, "专辑名过长"),
  description: z.string().max(2000, "专辑简介过长").optional(),
  songs: z.array(SongInputSchema).min(2, "专辑至少需要两首曲目"),
}).superRefine((album, context) => {
  const titles = new Set<string>();
  album.songs.forEach((song, index) => {
    if (titles.has(song.title)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["songs", index, "title"],
        message: `曲目标题重复: ${song.title}`,
      });
    }
    titles.add(song.title);
  });
});
