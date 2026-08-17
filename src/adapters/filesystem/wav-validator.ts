/**
 * WAV 文件校验 — §10.5 §16.5
 *
 * 校验 WAV 文件的格式和元数据：
 * - RIFF/WAVE 文件头
 * - 非零音频数据
 * - 采样率、位深、声道数
 *
 * 适配器实现：只负责 WAV 二进制解析和校验。
 */
import fs from "node:fs/promises";
import { ok, err, type ResultEnvelope } from "../../shared/result.js";
import { ErrorCodes } from "../../domain/errors.js";

export interface WavMetadata {
  durationSeconds: number;
  sampleRateHz: number;
  channels: number;
  bitDepth: number;
  dataSize: number;
  fileSize: number;
}

/**
 * 校验 WAV 文件并提取元数据。
 * §10.5 实测：PCM WAV，48kHz，16-bit，Stereo。
 */
export async function validateWav(filePath: string): Promise<ResultEnvelope<WavMetadata>> {
  try {
    const buffer = await fs.readFile(filePath);

    // 最小 WAV 文件头：44 字节
    if (buffer.length < 44) {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        `文件过小 (${buffer.length} 字节)，不是有效的 WAV 文件`,
      );
    }

    // RIFF 头
    const riff = buffer.toString("ascii", 0, 4);
    if (riff !== "RIFF") {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        `缺少 RIFF 头，实际: ${riff}`,
      );
    }

    // WAVE 标识
    const wave = buffer.toString("ascii", 8, 12);
    if (wave !== "WAVE") {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        `缺少 WAVE 标识，实际: ${wave}`,
      );
    }

    // fmt 子块
    const fmt = buffer.toString("ascii", 12, 16);
    if (fmt !== "fmt ") {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        `缺少 fmt 子块，实际: ${fmt}`,
      );
    }

    // 音频格式（PCM = 1）
    const audioFormat = buffer.readUInt16LE(20);
    if (audioFormat !== 1) {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        `非 PCM 格式 (audioFormat=${audioFormat})，仅支持 PCM WAV`,
      );
    }

    const channels = buffer.readUInt16LE(22);
    const sampleRate = buffer.readUInt32LE(24);
    const bitsPerSample = buffer.readUInt16LE(34);

    // 查找 data 子块
    let dataOffset = 36;
    let dataSize = 0;
    let foundData = false;

    while (dataOffset < buffer.length - 8) {
      const chunkId = buffer.toString("ascii", dataOffset, dataOffset + 4);
      const chunkSize = buffer.readUInt32LE(dataOffset + 4);

      if (chunkId === "data") {
        dataSize = chunkSize;
        foundData = true;
        break;
      }

      dataOffset += 8 + chunkSize;
    }

    if (!foundData) {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        "未找到 data 子块",
      );
    }

    // 非零音频数据检查
    if (dataSize === 0) {
      return err(
        ErrorCodes.WAV_INVALID_FORMAT,
        "音频数据大小为 0",
      );
    }

    // 计算时长
    const bytesPerSample = bitsPerSample / 8;
    const bytesPerSecond = sampleRate * channels * bytesPerSample;
    const durationSeconds = bytesPerSecond > 0 ? dataSize / bytesPerSecond : 0;

    const metadata: WavMetadata = {
      durationSeconds: Math.round(durationSeconds * 100) / 100,
      sampleRateHz: sampleRate,
      channels,
      bitDepth: bitsPerSample,
      dataSize,
      fileSize: buffer.length,
    };

    return ok(metadata);
  } catch (error) {
    return err(
      ErrorCodes.WAV_INVALID_FORMAT,
      `WAV 校验失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
