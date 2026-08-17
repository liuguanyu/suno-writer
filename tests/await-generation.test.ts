import { describe, it, expect } from "vitest";
import { awaitGeneration, areAllClipsComplete, extractClipInfo } from "../src/application/await-generation.js";
import { InMemoryAuthContext } from "../src/adapters/suno-http/transient-auth.js";
import type { GenerationReader } from "../src/ports/generation-reader.js";
import type { FeedResponse } from "../src/domain/generation.js";

function createMockReader(responses: FeedResponse[]): GenerationReader {
  let callIndex = 0;
  return {
    async queryStatus() {
      const response = responses[callIndex] ?? responses[responses.length - 1]!;
      callIndex++;
      return response;
    },
  };
}

describe("awaitGeneration", () => {
  it("所有 clip complete 且可下载时应返回成功", async () => {
    const mockResponse: FeedResponse = {
      clips: [
        {
          clipId: "clip-1",
          status: "complete",
          downloadSong: { disabled: false },
        },
        {
          clipId: "clip-2",
          status: "complete",
          downloadSong: { disabled: false },
        },
      ],
    };

    const result = await awaitGeneration({
      clipIds: ["clip-1", "clip-2"],
      batchId: "batch-1",
      auth: new InMemoryAuthContext(),
      reader: createMockReader([mockResponse]),
      totalTimeoutMs: 1000,
      pollIntervalMs: 10,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.allComplete).toBe(true);
    }
  });

  it("clip 失败时应返回部分失败", async () => {
    const mockResponse: FeedResponse = {
      clips: [
        {
          clipId: "clip-1",
          status: "complete",
          downloadSong: { disabled: false },
        },
        {
          clipId: "clip-2",
          status: "failed",
          errorMessage: "生成失败",
        },
      ],
    };

    const result = await awaitGeneration({
      clipIds: ["clip-1", "clip-2"],
      batchId: "batch-1",
      auth: new InMemoryAuthContext(),
      reader: createMockReader([mockResponse]),
      totalTimeoutMs: 1000,
      pollIntervalMs: 10,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("GENERATION_PARTIAL");
    }
  });

  it("超时时应返回超时错误", async () => {
    const mockResponse: FeedResponse = {
      clips: [
        { clipId: "clip-1", status: "streaming" },
        { clipId: "clip-2", status: "streaming" },
      ],
    };

    const result = await awaitGeneration({
      clipIds: ["clip-1", "clip-2"],
      batchId: "batch-1",
      auth: new InMemoryAuthContext(),
      reader: createMockReader([mockResponse]),
      totalTimeoutMs: 50,
      pollIntervalMs: 10,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("GENERATION_TIMEOUT");
    }
  });
});

describe("areAllClipsComplete", () => {
  it("所有 clip complete 且可下载时返回 true", () => {
    const response: FeedResponse = {
      clips: [
        { clipId: "c1", status: "complete", downloadSong: { disabled: false } },
        { clipId: "c2", status: "complete", downloadSong: { disabled: false } },
      ],
    };
    expect(areAllClipsComplete(response)).toBe(true);
  });

  it("downloadSong.disabled 为 true 时返回 false", () => {
    const response: FeedResponse = {
      clips: [
        { clipId: "c1", status: "complete", downloadSong: { disabled: true } },
        { clipId: "c2", status: "complete", downloadSong: { disabled: false } },
      ],
    };
    expect(areAllClipsComplete(response)).toBe(false);
  });
});

describe("extractClipInfo", () => {
  it("应正确提取 clip 信息", () => {
    const response: FeedResponse = {
      clips: [
        { clipId: "c1", status: "complete", audioUrl: "url1", duration: 120 },
        { clipId: "c2", status: "streaming" },
      ],
    };
    const infos = extractClipInfo(response);
    expect(infos).toHaveLength(2);
    expect(infos[0]?.clipId).toBe("c1");
    expect(infos[0]?.audioUrl).toBe("url1");
    expect(infos[1]?.status).toBe("streaming");
  });
});
