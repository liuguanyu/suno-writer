/**
 * WAV 转换客户端 — §10.4
 *
 * 对每个 clip 触发 WAV 转换并轮询获取 wav_file_url。
 * 适配器实现：只负责 convert_wav 和 wav_file 的 HTTP 调用。
 */
import { ok, err, type ResultEnvelope } from "../../shared/result.js";
import { ErrorCodes } from "../../domain/errors.js";
import {
  WavFileInfoSchema,
  type WavFileInfo,
} from "../../domain/generation.js";
import type { WavConverter } from "../../ports/wav-converter.js";
import type { TransientAuthContext } from "../../ports/transient-auth-context.js";
import { InMemoryAuthContext } from "./transient-auth.js";
import { PollingStrategy } from "../../shared/timeout.js";

const SUNO_API_BASE = "https://studio-api-prod.suno.com/api/gen";

export class SunoHttpWavConverter implements WavConverter {
  private readonly pollIntervalMs: number;
  private readonly maxWaitMs: number;

  constructor(
    pollIntervalMs: number = PollingStrategy.WAV_POLL_INTERVAL_MS,
    maxWaitMs: number = PollingStrategy.WAV_TOTAL_TIMEOUT_MS,
  ) {
    this.pollIntervalMs = pollIntervalMs;
    this.maxWaitMs = maxWaitMs;
  }

  async convertAndGetUrl(
    clipId: string,
    auth: TransientAuthContext,
  ): Promise<WavFileInfo> {
    const authCtx = auth as InMemoryAuthContext;

    await this.triggerConversion(clipId, authCtx);
    return await this.pollWavFileUrl(clipId, authCtx);
  }

  private async triggerConversion(
    clipId: string,
    auth: InMemoryAuthContext,
  ): Promise<void> {
    const url = `${SUNO_API_BASE}/${clipId}/convert_wav/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...auth.getHeaders(),
      },
      body: "{}",
    });

    if (response.status === 401) {
      throw new Error("Suno 认证失效 (401)，请重新登录");
    }

    if (response.status !== 204 && response.status !== 200) {
      throw new Error(
        `WAV 转换触发失败: HTTP ${response.status} ${response.statusText}`,
      );
    }
  }

  private async pollWavFileUrl(
    clipId: string,
    auth: InMemoryAuthContext,
  ): Promise<WavFileInfo> {
    const url = `${SUNO_API_BASE}/${clipId}/wav_file/`;
    const startTime = Date.now();

    while (Date.now() - startTime < this.maxWaitMs) {
      const response = await fetch(url, {
        headers: {
          ...auth.getHeaders(),
        },
      });

      if (response.status === 401) {
        throw new Error("Suno 认证失效 (401)，请重新登录");
      }

      if (response.ok) {
        const raw = await response.json();
        const result = WavFileInfoSchema.safeParse(raw);

        if (result.success) {
          return {
            wavFileUrl: result.data.wav_file_url,
            clipId,
          };
        }
      }

      await sleep(this.pollIntervalMs);
    }

    throw new Error(`WAV 转换超时: clipId=${clipId}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function safeConvertWav(
  converter: WavConverter,
  clipId: string,
  auth: TransientAuthContext,
): Promise<ResultEnvelope<WavFileInfo>> {
  try {
    const info = await converter.convertAndGetUrl(clipId, auth);
    return ok(info);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("401")) {
      return err(ErrorCodes.AUTH_UNAUTHORIZED, message);
    }
    if (message.includes("超时")) {
      return err(ErrorCodes.WAV_CONVERSION_TIMEOUT, message);
    }

    return err(ErrorCodes.WAV_CONVERSION_FAILED, message);
  }
}
