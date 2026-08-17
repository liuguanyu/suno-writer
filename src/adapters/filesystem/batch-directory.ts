/**
 * 批次目录管理 — §15
 *
 * 负责创建和管理 outputs/<timestamp>-<slug>/ 目录结构。
 * 适配器实现：纯文件系统操作，不知道 Suno 的 URL、认证头或页面结构。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { ok, err, type ResultEnvelope } from "../../shared/result.js";
import { ErrorCodes } from "../../domain/errors.js";
import { timestampPrefix, toSlug } from "../../shared/slug.js";

const OUTPUTS_DIR = "outputs";

/**
 * 创建批次输出目录。
 * 格式：outputs/<timestamp>-<slug>/
 */
export async function createBatchDirectory(
  title: string,
  outputsDir: string = OUTPUTS_DIR,
): Promise<ResultEnvelope<string>> {
  const ts = timestampPrefix();
  const slug = toSlug(title);
  const dirName = `${ts}-${slug}`;
  const batchDir = path.join(outputsDir, dirName);

  try {
    await fs.mkdir(batchDir, { recursive: true });
    return ok(batchDir);
  } catch (error) {
    return err(
      ErrorCodes.FILE_WRITE_ERROR,
      `无法创建批次目录 ${batchDir}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * 确保输出根目录存在。
 */
export async function ensureOutputsDir(
  outputsDir: string = OUTPUTS_DIR,
): Promise<ResultEnvelope<string>> {
  try {
    await fs.mkdir(outputsDir, { recursive: true });
    const absPath = path.resolve(outputsDir);
    return ok(absPath);
  } catch (error) {
    return err(
      ErrorCodes.FILE_WRITE_ERROR,
      `无法创建输出目录: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * 检查批次目录是否存在。
 */
export async function batchDirectoryExists(batchDir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(batchDir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * 列出所有输出批次目录。
 */
export async function listBatchDirectories(
  outputsDir: string = OUTPUTS_DIR,
): Promise<string[]> {
  try {
    const entries = await fs.readdir(outputsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => path.join(outputsDir, e.name))
      .sort();
  } catch {
    return [];
  }
}
