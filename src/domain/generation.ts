/**
 * 生成领域类型 — §10 §13 §14 的生成状态与批次管理。
 */
import { z } from "zod";

/**
 * §13 建议的任务状态机。
 */
export const TaskStatus = {
  DRAFT: "draft",
  AWAITING_CONFIRMATION: "awaiting_confirmation",
  SUBMITTING: "submitting",
  SUBMITTED: "submitted",
  GENERATING: "generating",
  CONVERTING_WAV: "converting_wav",
  DOWNLOADING: "downloading",
  COMPLETED: "completed",
  PARTIAL_FAILURE: "partial_failure",
  FAILED: "failed",
  UNKNOWN_SUBMISSION_STATE: "unknown_submission_state",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

/**
 * §10.3 已观察到的 clip 生成状态。
 */
export const ClipStatus = {
  SUBMITTED: "submitted",
  STREAMING: "streaming",
  COMPLETE: "complete",
  FAILED: "failed",
} as const;

export type ClipStatus = (typeof ClipStatus)[keyof typeof ClipStatus];

/**
 * §10.2 提交生成后的响应中的 clip 信息。
 */
export interface ClipInfo {
  clipId: string;
  status: ClipStatus;
  audioUrl?: string;
  duration?: number;
}

/**
 * §10.2 提交生成的响应（从 generate/v2-web 提取）。
 */
export interface GenerationResponse {
  batchId: string;
  modelDisplayName: string;
  clips: [ClipInfo, ClipInfo];
}

/**
 * §10.3 查询生成状态的请求。
 */
export interface FeedQueryRequest {
  clipIds: [string, string];
  limit: number;
}

/**
 * §10.3 查询生成状态的响应中的单个 clip。
 */
export interface FeedClip {
  clipId: string;
  status: ClipStatus;
  audioUrl?: string;
  mediaUrls?: string[];
  duration?: number;
  downloadSong?: {
    disabled: boolean;
  };
  errorMessage?: string;
}

/**
 * §10.3 查询生成状态的完整响应。
 */
export interface FeedResponse {
  clips: FeedClip[];
}

export const FeedClipSchema = z.object({
  clipId: z.string(),
  status: z.enum(["submitted", "streaming", "complete", "failed"]),
  audioUrl: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  duration: z.number().optional(),
  downloadSong: z.object({ disabled: z.boolean() }).optional(),
  errorMessage: z.string().optional(),
});

export const FeedResponseSchema = z.object({
  clips: z.array(FeedClipSchema),
});

/**
 * §10.4 WAV 转换结果。
 */
export interface WavFileInfo {
  wavFileUrl: string;
  clipId: string;
}

export const WavFileInfoSchema = z.object({
  wav_file_url: z.string().url(),
});
