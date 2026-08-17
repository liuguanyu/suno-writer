/**
 * 获取 WAV 文件用例 — §10.4 §15 §16.5
 *
 * 编排 WAV 转换和下载流程：
 * 1. 对每个 clip 触发 WAV 转换
 * 2. 轮询获取 wav_file_url
 * 3. 流式下载 WAV 文件
 * 4. 校验 WAV 格式
 * 5. 更新 manifest
 *
 * Application 层：组合 WavConverter、FileDownloader 和 ManifestStore 端口。
 */
import { ok, type ResultEnvelope } from "../shared/result.js";
import type { TrackEntry } from "../domain/manifest.js";
import type { WavConverter } from "../ports/wav-converter.js";
import type { FileDownloader } from "../ports/file-downloader.js";
import type { ManifestStore } from "../ports/manifest-store.js";
import type { TransientAuthContext } from "../ports/transient-auth-context.js";
import { safeConvertWav } from "../adapters/suno-http/wav-conversion-client.js";
import { safeDownload } from "../adapters/filesystem/stream-downloader.js";
import { validateWav, type WavMetadata } from "../adapters/filesystem/wav-validator.js";
import { sha256File } from "../adapters/filesystem/stream-downloader.js";

export interface AcquireWavInput {
  clipIds: [string, string];
  batchDir: string;
  slug: string;
  taskId: string;
  auth: TransientAuthContext;
  converter: WavConverter;
  downloader: FileDownloader;
  manifestStore: ManifestStore;
}

export interface AcquireWavOutput {
  tracks: TrackEntry[];
  allDownloaded: boolean;
}

export async function acquireWav(
  input: AcquireWavInput,
): Promise<ResultEnvelope<AcquireWavOutput>> {
  const warnings: string[] = [];
  const tracks: TrackEntry[] = [];

  await input.manifestStore.patch(input.batchDir, {
    taskId: input.taskId,
    status: "converting_wav",
    warnings,
  });

  for (let i = 0; i < input.clipIds.length; i++) {
    const clipId = input.clipIds[i]!;
    const index = i + 1;
    const filename = `${String(index).padStart(2, "0")}-${input.slug}.wav`;

    try {
      const convertResult = await safeConvertWav(input.converter, clipId, input.auth);

      if (!convertResult.ok) {
        warnings.push(`WAV 转换失败 (clipId=${clipId}): ${convertResult.error.message}`);
        tracks.push({
          index,
          clipId,
          status: "failed",
          file: filename,
        });
        continue;
      }

      const wavUrl = convertResult.data.wavFileUrl;
      await downloadAndValidate(
        input.downloader,
        wavUrl,
        input.batchDir,
        filename,
        clipId,
        index,
        tracks,
        warnings,
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      warnings.push(`获取 WAV 失败 (clipId=${clipId}): ${errorMsg}`);
      tracks.push({
        index,
        clipId,
        status: "failed",
        file: filename,
      });
    }
  }

  const allDownloaded = tracks.every((t) => t.status === "downloaded");
  const anyDownloaded = tracks.some((t) => t.status === "downloaded");
  const finalStatus = allDownloaded
    ? "completed"
    : anyDownloaded
      ? "partial_failure"
      : "failed";

  await input.manifestStore.patch(input.batchDir, {
    taskId: input.taskId,
    status: finalStatus,
    completedAt: finalStatus === "completed" ? new Date().toISOString() : undefined,
    tracks,
    warnings,
  });

  return ok({ tracks, allDownloaded });
}

async function downloadAndValidate(
  downloader: FileDownloader,
  url: string,
  batchDir: string,
  filename: string,
  clipId: string,
  index: number,
  tracks: TrackEntry[],
  warnings: string[],
): Promise<void> {
  const downloadResult = await safeDownload(downloader, url, batchDir, filename);

  if (!downloadResult.ok) {
    throw new Error(`下载失败: ${downloadResult.error.message}`);
  }

  const filePath = downloadResult.data;

  const validateResult = await validateWav(filePath);
  if (!validateResult.ok) {
    warnings.push(`WAV 校验失败 (${filename}): ${validateResult.error.message}`);
    tracks.push({
      index,
      clipId,
      status: "failed",
      file: filename,
    });
    return;
  }

  let sha256 = "";
  try {
    sha256 = await sha256File(filePath);
  } catch {
    warnings.push(`无法计算 SHA256: ${filename}`);
  }

  const metadata: WavMetadata = validateResult.data;
  tracks.push({
    index,
    clipId,
    status: "downloaded",
    file: filename,
    durationSeconds: metadata.durationSeconds,
    sampleRateHz: metadata.sampleRateHz,
    channels: metadata.channels,
    bitDepth: metadata.bitDepth,
    sha256: sha256 || undefined,
  });
}
