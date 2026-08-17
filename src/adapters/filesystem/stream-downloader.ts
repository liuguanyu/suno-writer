/**
 * 流式下载器 — §11.2 §16.5
 *
 * 从 URL 流式下载文件到本地。
 * 使用临时文件名 (.part)，完成后原子重命名。
 * 支持超时、中断和 SHA256 校验。
 *
 * 适配器实现：只负责 URL → 文件的流式传输。
 */
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { ok, err, type ResultEnvelope } from "../../shared/result.js";
import { ErrorCodes } from "../../domain/errors.js";
import { createTimeoutSignal, PollingStrategy } from "../../shared/timeout.js";
import type { FileDownloader } from "../../ports/file-downloader.js";

export class StreamDownloader implements FileDownloader {
  private readonly timeoutMs: number;

  constructor(timeoutMs: number = PollingStrategy.CDN_DOWNLOAD_TIMEOUT_MS) {
    this.timeoutMs = timeoutMs;
  }

  async download(
    url: string,
    destDir: string,
    filename: string,
    expectedSha256?: string,
  ): Promise<string> {
    const partFile = path.join(destDir, `${filename}.part`);
    const finalFile = path.join(destDir, filename);
    const { signal, clear } = createTimeoutSignal(this.timeoutMs);

    try {
      // 如果目标文件已存在且已通过校验，跳过下载（§11.2 规则 5）
      if (await this.verifyExistingFile(finalFile, expectedSha256)) {
        return finalFile;
      }

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      // 流式写入临时文件
      const fileStream = fs.createWriteStream(partFile);
      await pipeline(response.body, fileStream);

      // 校验 SHA256（如提供）
      if (expectedSha256) {
        const actualSha256 = await sha256File(partFile);
        if (actualSha256 !== expectedSha256) {
          await fsPromises.unlink(partFile).catch(() => {});
          throw new Error(
            `SHA256 校验失败: 期望 ${expectedSha256}, 实际 ${actualSha256}`,
          );
        }
      }

      // 原子重命名 .part → .wav
      await fsPromises.rename(partFile, finalFile);

      return finalFile;
    } catch (error) {
      // 清理不完整的临时文件（§16.5）
      await fsPromises.unlink(partFile).catch(() => {});

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`下载超时 (${this.timeoutMs}ms): ${url}`);
      }
      throw error;
    } finally {
      clear();
    }
  }

  async checkUrlAccessible(url: string): Promise<boolean> {
    const { signal, clear } = createTimeoutSignal(10000);

    try {
      const response = await fetch(url, { method: "HEAD", signal });
      return response.ok;
    } catch {
      return false;
    } finally {
      clear();
    }
  }

  /**
   * 检查已存在的文件是否有效。
   * §11.2 规则 5：已有完整目标文件时不得无条件重复下载。
   */
  private async verifyExistingFile(
    filePath: string,
    expectedSha256?: string,
  ): Promise<boolean> {
    try {
      await fsPromises.access(filePath, fs.constants.R_OK);
      if (expectedSha256) {
        const actualSha256 = await sha256File(filePath);
        return actualSha256 === expectedSha256;
      }
      // 没有期望哈希时，只检查文件存在且大于 0
      const stat = await fsPromises.stat(filePath);
      return stat.size > 0;
    } catch {
      return false;
    }
  }
}

/**
 * 计算文件的 SHA256 哈希。
 */
export async function sha256File(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: string | Buffer) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

/**
 * 将 StreamDownloader 包装为带 ResultEnvelope 的安全调用。
 */
export async function safeDownload(
  downloader: FileDownloader,
  url: string,
  destDir: string,
  filename: string,
  expectedSha256?: string,
): Promise<ResultEnvelope<string>> {
  try {
    const filePath = await downloader.download(url, destDir, filename, expectedSha256);
    return ok(filePath);
  } catch (error) {
    return err(
      ErrorCodes.WAV_DOWNLOAD_FAILED,
      error instanceof Error ? error.message : String(error),
    );
  }
}
