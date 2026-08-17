/**
 * WAV Converter 端口 — §10.4
 *
 * 负责触发 WAV 转换并获取 wav_file_url。
 * 适配器：Suno HTTP convert_wav + wav_file。
 */
import type { WavFileInfo } from "../domain/generation.js";
import type { TransientAuthContext } from "./transient-auth-context.js";

export interface WavConverter {
  /**
   * 对指定 clip 触发 WAV 转换并轮询获取 CDN 地址。
   */
  convertAndGetUrl(
    clipId: string,
    auth: TransientAuthContext,
  ): Promise<WavFileInfo>;
}
