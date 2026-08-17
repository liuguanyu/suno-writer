/**
 * 恢复批次用例 — §14 §15
 *
 * 基于已有的 batch ID 和 clip ID 继续未完成的任务。
 * 适用于：
 * - 生成超时后的恢复
 * - 下载中断后的续传
 * - 网络恢复后的继续
 *
 * Application 层：组合 GenerationReader、WavConverter 和 ManifestStore 端口。
 */
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";
import type { Manifest } from "../domain/manifest.js";
import type { GenerationReader } from "../ports/generation-reader.js";
import type { WavConverter } from "../ports/wav-converter.js";
import type { FileDownloader } from "../ports/file-downloader.js";
import type { ManifestStore } from "../ports/manifest-store.js";
import type { TransientAuthContext } from "../ports/transient-auth-context.js";
import { awaitGeneration } from "./await-generation.js";
import { acquireWav } from "./acquire-wav.js";

export interface ResumeBatchInput {
  batchDir: string;
  auth: TransientAuthContext;
  reader: GenerationReader;
  converter: WavConverter;
  downloader: FileDownloader;
  manifestStore: ManifestStore;
}

export interface ResumeBatchOutput {
  manifest: Manifest;
}

/**
 * 恢复批次的完整流程：
 * 1. 读取已有 manifest
 * 2. 判断当前状态
 * 3. 继续未完成的步骤
 *
 * §14 超时后：保留 batch ID 和 clip ID，不重新提交生成。
 */
export async function resumeBatch(
  input: ResumeBatchInput,
): Promise<ResultEnvelope<ResumeBatchOutput>> {
  // 1. 读取 manifest
  const manifest = await input.manifestStore.read(input.batchDir);

  if (!manifest) {
    return err(
      ErrorCodes.FILE_NOT_FOUND,
      `未找到 manifest: ${input.batchDir}`,
    );
  }

  const clipIds = manifest.suno.clipIds;

  if (clipIds.length < 2) {
    return err(
      ErrorCodes.MANIFEST_INVALID,
      `Manifest 中的 clipIds 不完整: ${clipIds.length} 个`,
    );
  }

  const warnings = [...manifest.warnings];

  // 2. 判断状态并继续
  const currentStatus = manifest.status;

  // 如果还在生成阶段（submitted/generating/timeout），继续等待生成
  if (
    currentStatus === "submitted" ||
    currentStatus === "generating" ||
    currentStatus === "unknown_submission_state"
  ) {
    const awaitResult = await awaitGeneration({
      clipIds: clipIds as [string, string],
      batchId: manifest.suno.batchId ?? "",
      auth: input.auth,
      reader: input.reader,
    });

    if (!awaitResult.ok) {
      // 更新 manifest 状态
      await input.manifestStore.patch(input.batchDir, {
        taskId: manifest.taskId,
        status: awaitResult.error.code === ErrorCodes.GENERATION_TIMEOUT
          ? "generating"
          : "failed",
        warnings: [...warnings, ...awaitResult.warnings],
      });
      return awaitResult;
    }

    warnings.push(...awaitResult.warnings);
  }

  // 如果生成已完成，继续获取 WAV
  // 跳过已下载的 track
  const pendingClips = manifest.tracks
    .filter((t) => t.status !== "downloaded")
    .map((t) => t.clipId)
    .filter(Boolean) as string[];

  if (pendingClips.length > 0) {
    const acquireResult = await acquireWav({
      clipIds: pendingClips.length >= 2
        ? (pendingClips.slice(0, 2) as [string, string])
        : ([pendingClips[0]!, pendingClips[0]!] as [string, string]),
      batchDir: input.batchDir,
      slug: manifest.slug,
      taskId: manifest.taskId,
      auth: input.auth,
      converter: input.converter,
      downloader: input.downloader,
      manifestStore: input.manifestStore,
    });

    if (!acquireResult.ok) {
      return acquireResult;
    }

    warnings.push(...acquireResult.warnings);
  }

  // 重新读取最终 manifest
  const finalManifest = await input.manifestStore.read(input.batchDir);

  return ok({
    manifest: finalManifest ?? manifest,
  });
}
