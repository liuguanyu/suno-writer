import { describe, it, expect } from "vitest";
import { SongInputSchema } from "../src/domain/song.js";
import { ErrorCodes } from "../src/domain/errors.js";
import { TaskStatus, ClipStatus } from "../src/domain/generation.js";
import { ManifestSchema, CURRENT_SCHEMA_VERSION } from "../src/domain/manifest.js";
import { ok, err } from "../src/shared/result.js";

describe("SongInputSchema", () => {
  it("应接受合法输入", () => {
    const result = SongInputSchema.safeParse({
      lyrics: "[Verse 1]\n月下独酌",
      style: "Chamber Pop",
      title: "月下独酌",
      cleanLyrics: "月下独酌",
    });
    expect(result.success).toBe(true);
  });

  it("应拒绝空歌词", () => {
    const result = SongInputSchema.safeParse({
      lyrics: "",
      style: "Chamber Pop",
      title: "月下独酌",
      cleanLyrics: "月下独酌",
    });
    expect(result.success).toBe(false);
  });

  it("应拒绝超过 5000 字符的歌词", () => {
    const result = SongInputSchema.safeParse({
      lyrics: "a".repeat(5001),
      style: "Chamber Pop",
      title: "月下独酌",
      cleanLyrics: "月下独酌",
    });
    expect(result.success).toBe(false);
  });

  it("应拒绝超过 1000 字符的 Style", () => {
    const result = SongInputSchema.safeParse({
      lyrics: "月下独酌",
      style: "a".repeat(1001),
      title: "月下独酌",
      cleanLyrics: "月下独酌",
    });
    expect(result.success).toBe(false);
  });
});

describe("ErrorCodes", () => {
  it("错误码应为稳定字符串", () => {
    expect(ErrorCodes.LYRICS_TOO_LONG).toBe("LYRICS_TOO_LONG");
    expect(ErrorCodes.SUBMIT_NOT_AUTHORIZED).toBe("SUBMIT_NOT_AUTHORIZED");
    expect(ErrorCodes.GENERATION_TIMEOUT).toBe("GENERATION_TIMEOUT");
    expect(ErrorCodes.AUTH_EXPIRED).toBe("AUTH_EXPIRED");
    expect(ErrorCodes.WAV_INVALID_FORMAT).toBe("WAV_INVALID_FORMAT");
  });
});

describe("TaskStatus", () => {
  it("应包含所有状态", () => {
    expect(TaskStatus.DRAFT).toBe("draft");
    expect(TaskStatus.AWAITING_CONFIRMATION).toBe("awaiting_confirmation");
    expect(TaskStatus.SUBMITTING).toBe("submitting");
    expect(TaskStatus.SUBMITTED).toBe("submitted");
    expect(TaskStatus.COMPLETED).toBe("completed");
    expect(TaskStatus.PARTIAL_FAILURE).toBe("partial_failure");
    expect(TaskStatus.FAILED).toBe("failed");
    expect(TaskStatus.UNKNOWN_SUBMISSION_STATE).toBe("unknown_submission_state");
  });
});

describe("ClipStatus", () => {
  it("应包含所有 clip 状态", () => {
    expect(ClipStatus.SUBMITTED).toBe("submitted");
    expect(ClipStatus.STREAMING).toBe("streaming");
    expect(ClipStatus.COMPLETE).toBe("complete");
    expect(ClipStatus.FAILED).toBe("failed");
  });
});

describe("ManifestSchema", () => {
  it("应接受合法 manifest", () => {
    const result = ManifestSchema.safeParse({
      schemaVersion: 1,
      taskId: "task-uuid",
      title: "月下独酌",
      slug: "yue-xia-du-zhuo",
      status: "completed",
      submittedAt: "2026-08-05T03:57:05Z",
      completedAt: "2026-08-05T04:10:00Z",
      suno: {
        batchId: "batch-1",
        modelDisplayName: "v5.5",
        clipIds: ["clip-1", "clip-2"],
      },
      inputs: {
        lyricsSha256: "abc123",
        styleSha256: "def456",
      },
      tracks: [
        {
          index: 1,
          clipId: "clip-1",
          status: "downloaded",
          file: "01-yue-xia-du-zhuo.wav",
          durationSeconds: 177.64,
          sampleRateHz: 48000,
          channels: 2,
          bitDepth: 16,
          sha256: "sha-1",
        },
      ],
      warnings: [],
    });
    expect(result.success).toBe(true);
  });

  it("schemaVersion 必须为 1", () => {
    const result = ManifestSchema.safeParse({
      schemaVersion: 2,
      taskId: "task-uuid",
      title: "月下独酌",
      slug: "yue-xia-du-zhuo",
      status: "completed",
      suno: { clipIds: [] },
      inputs: { lyricsSha256: "", styleSha256: "" },
      tracks: [],
      warnings: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("ResultEnvelope", () => {
  it("ok() 应返回成功信封", () => {
    const result = ok({ value: 1 });
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ value: 1 });
    expect(result.warnings).toEqual([]);
  });

  it("err() 应返回错误信封", () => {
    const result = err("ERROR_CODE", "错误消息");
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("ERROR_CODE");
    expect(result.error.message).toBe("错误消息");
  });

  it("ok() 可携带警告", () => {
    const result = ok("data", ["warning1"]);
    expect(result.warnings).toEqual(["warning1"]);
  });
});

describe("CURRENT_SCHEMA_VERSION", () => {
  it("应为 1", () => {
    expect(CURRENT_SCHEMA_VERSION).toBe(1);
  });
});
