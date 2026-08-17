/**
 * 等待生成完成用例 — §14 §10.3 §10.5
 *
 * 编排状态轮询：通过 feed/v3 接口查询。
 *
 * Application 层：组合 GenerationReader 端口和重试/超时策略。
 */
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";
import type { ClipStatus, FeedResponse, ClipInfo } from "../domain/generation.js";
import type { GenerationReader } from "../ports/generation-reader.js";
import type { TransientAuthContext } from "../ports/transient-auth-context.js";
import { PollingStrategy } from "../shared/timeout.js";

export interface AwaitGenerationInput {
  clipIds: [string, string];
  batchId: string;
  auth: TransientAuthContext;
  reader: GenerationReader;
  /** 单首歌曲生成总超时（毫秒），默认 15 分钟 */
  totalTimeoutMs?: number;
  /** 初始轮询间隔（毫秒），默认 5 秒 */
  pollIntervalMs?: number;
}

export interface AwaitGenerationOutput {
  clips: Array<{
    clipId: string;
    status: ClipStatus;
    audioUrl?: string;
    duration?: number;
  }>;
  allComplete: boolean;
}

/**
 * 等待两个 clip 生成完成的完整流程：
 * 1. 循环轮询 feed/v3 接口
 * 2. 超时后保留状态为可恢复
 * 3. 部分失败时如实报告
 */
export async function awaitGeneration(
  input: AwaitGenerationInput,
): Promise<ResultEnvelope<AwaitGenerationOutput>> {
  const totalTimeout = input.totalTimeoutMs ?? PollingStrategy.GENERATION_TOTAL_TIMEOUT_MS;
  const pollInterval = input.pollIntervalMs ?? PollingStrategy.GENERATION_INITIAL_INTERVAL_MS;
  const startTime = Date.now();
  const warnings: string[] = [];
  let lastFeedResponse: FeedResponse | null = null;

  while (Date.now() - startTime < totalTimeout) {
    try {
      lastFeedResponse = await input.reader.queryStatus(
        {
          clipIds: input.clipIds,
          limit: 2,
        },
        input.auth,
      );

      const clips = lastFeedResponse.clips;
      const allComplete = clips.every((c) => c.status === "complete");
      const anyFailed = clips.some((c) => c.status === "failed");

      // §16.3: 一首成功、一首失败
      if (anyFailed) {
        const failedClip = clips.find((c) => c.status === "failed");
        return err(
          ErrorCodes.GENERATION_PARTIAL,
          `生成部分失败: clipId=${failedClip?.clipId}, error=${failedClip?.errorMessage ?? "unknown"}`,
          warnings,
        );
      }

      // 完成判据（§10.3）：
      // 1. clip 状态进入 complete
      // 2. download_song.disabled == false
      if (allComplete) {
        const allDownloadable = clips.every(
          (c) => c.downloadSong?.disabled === false,
        );

        if (allDownloadable) {
          return ok({
            clips: clips.map((c) => ({
              clipId: c.clipId,
              status: c.status,
              audioUrl: c.audioUrl,
              duration: c.duration,
            })),
            allComplete: true,
          });
        }

        warnings.push("状态为 complete 但下载尚未就绪，继续等待");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      if (errorMsg.includes("401")) {
        return err(ErrorCodes.AUTH_EXPIRED, "认证已失效，请重新登录", warnings);
      }

      warnings.push(`状态查询失败: ${errorMsg}`);
    }

    await sleep(pollInterval);
  }

  return err(
    ErrorCodes.GENERATION_TIMEOUT,
    `生成超时 (${totalTimeout}ms)。batchId=${input.batchId}, clipIds=${input.clipIds.join(", ")}。可稍后基于这些 ID 继续查询。`,
    warnings,
  );
}

export function areAllClipsComplete(response: FeedResponse): boolean {
  return response.clips.every(
    (c) => c.status === "complete" && c.downloadSong?.disabled === false,
  );
}

export function extractClipInfo(response: FeedResponse): ClipInfo[] {
  return response.clips.map((c) => ({
    clipId: c.clipId,
    status: c.status,
    audioUrl: c.audioUrl,
    duration: c.duration,
  }));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
