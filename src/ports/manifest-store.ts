/**
 * Manifest Store 端口 — §15.2
 *
 * 负责 manifest.json 的读取、校验和原子写入。
 * 适配器：Node.js 文件系统操作。
 */
import type { Manifest } from "../domain/manifest.js";

export interface ManifestStore {
  /**
   * 读取并校验已有 manifest。
   */
  read(batchDir: string): Promise<Manifest | null>;

  /**
   * 原子写入 manifest（先写临时文件再重命名）。
   */
  write(batchDir: string, manifest: Manifest): Promise<void>;

  /**
   * 更新 manifest 中的部分字段（读取-修改-写入）。
   */
  patch(
    batchDir: string,
    patch: Partial<Manifest> & { taskId: string },
  ): Promise<Manifest>;

  /**
   * 列出所有已存在的批次 manifest。
   */
  listAll(outputsDir: string): Promise<Manifest[]>;
}
