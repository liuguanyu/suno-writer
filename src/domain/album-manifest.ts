import { z } from "zod";

export const AlbumTrackStatusSchema = z.enum([
  "pending",
  "submitted",
  "unknown_submission_state",
]);

export const AlbumManifestSchema = z.object({
  schemaVersion: z.literal(1),
  albumId: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(["submitting", "submitted", "partial_failure"]),
  createdAt: z.string(),
  tracks: z.array(z.object({
    index: z.number().int().positive(),
    title: z.string(),
    status: AlbumTrackStatusSchema,
    batchDir: z.string().optional(),
    taskId: z.string().optional(),
    batchId: z.string().optional(),
    error: z.string().optional(),
  })),
  warnings: z.array(z.string()),
});

export type AlbumManifest = z.infer<typeof AlbumManifestSchema>;
