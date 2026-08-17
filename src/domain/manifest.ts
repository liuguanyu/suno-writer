/**
 * Manifest 领域类型 — §15.2 manifest.json 的 TypeScript 表示。
 */
import { z } from "zod";
import type { TaskStatus } from "./generation.js";

/**
 * §15.2 manifest.json 结构。
 */
export interface Manifest {
  schemaVersion: number;
  taskId: string;
  title: string;
  slug: string;
  status: TaskStatus;
  submittedAt?: string;
  completedAt?: string;
  suno: {
    batchId?: string;
    modelDisplayName?: string;
    clipIds: string[];
  };
  inputs: {
    lyricsSha256: string;
    styleSha256: string;
  };
  tracks: TrackEntry[];
  warnings: string[];
}

export interface TrackEntry {
  index: number;
  clipId?: string;
  status: "pending" | "downloading" | "downloaded" | "failed";
  file?: string;
  durationSeconds?: number;
  sampleRateHz?: number;
  channels?: number;
  bitDepth?: number;
  sha256?: string;
}

export const TrackEntrySchema = z.object({
  index: z.number().int().positive(),
  clipId: z.string().optional(),
  status: z.enum(["pending", "downloading", "downloaded", "failed"]),
  file: z.string().optional(),
  durationSeconds: z.number().optional(),
  sampleRateHz: z.number().int().optional(),
  channels: z.number().int().optional(),
  bitDepth: z.number().int().optional(),
  sha256: z.string().optional(),
});

export const ManifestSchema = z.object({
  schemaVersion: z.literal(1),
  taskId: z.string(),
  title: z.string(),
  slug: z.string(),
  status: z.string(),
  submittedAt: z.string().optional(),
  completedAt: z.string().optional(),
  suno: z.object({
    batchId: z.string().optional(),
    modelDisplayName: z.string().optional(),
    clipIds: z.array(z.string()),
  }),
  inputs: z.object({
    lyricsSha256: z.string(),
    styleSha256: z.string(),
  }),
  tracks: z.array(TrackEntrySchema),
  warnings: z.array(z.string()),
});

export const CURRENT_SCHEMA_VERSION = 1;
