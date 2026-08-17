/**
 * JSON Manifest Store — §15.2
 *
 * 负责 manifest.json 的读取、校验和原子写入。
 * 禁止写入 Cookie、Token、邮箱等敏感信息。
 *
 * 适配器实现：只负责 manifest 文件 I/O。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { ManifestSchema, CURRENT_SCHEMA_VERSION, type Manifest } from "../../domain/manifest.js";
import type { ManifestStore } from "../../ports/manifest-store.js";
import type { TaskStatus } from "../../domain/generation.js";

const MANIFEST_FILE = "manifest.json";

export class JsonManifestStore implements ManifestStore {
  async read(batchDir: string): Promise<Manifest | null> {
    try {
      const filePath = path.join(batchDir, MANIFEST_FILE);
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      const result = ManifestSchema.safeParse(parsed);

      if (!result.success) {
        return null;
      }

      return result.data as Manifest;
    } catch {
      return null;
    }
  }

  async write(batchDir: string, manifest: Manifest): Promise<void> {
    const filePath = path.join(batchDir, MANIFEST_FILE);
    const tmpPath = path.join(batchDir, ".manifest.tmp");

    // 校验
    const result = ManifestSchema.safeParse(manifest);
    if (!result.success) {
      throw new Error(`Manifest 校验失败: ${result.error.message}`);
    }

    const json = JSON.stringify(result.data, null, 2);

    // 原子写入：先写临时文件，再重命名
    await fs.writeFile(tmpPath, json, "utf-8");
    await fs.rename(tmpPath, filePath);
  }

  async patch(
    batchDir: string,
    patch: Partial<Manifest> & { taskId: string },
  ): Promise<Manifest> {
    let existing = await this.read(batchDir);

    if (!existing) {
      // 创建新的 manifest
      existing = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taskId: patch.taskId,
        title: patch.title ?? "Untitled",
        slug: patch.slug ?? "untitled",
        status: "draft",
        suno: { clipIds: [] },
        inputs: { lyricsSha256: "", styleSha256: "" },
        tracks: [],
        warnings: [],
      };
    }

    // 合并
    const updated: Manifest = {
      ...existing,
      ...patch,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      suno: {
        ...existing.suno,
        ...(patch.suno ?? {}),
      },
      inputs: {
        ...existing.inputs,
        ...(patch.inputs ?? {}),
      },
    };

    await this.write(batchDir, updated);
    return updated;
  }

  async listAll(outputsDir: string): Promise<Manifest[]> {
    try {
      const entries = await fs.readdir(outputsDir, { withFileTypes: true });
      const manifests: Manifest[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const batchDir = path.join(outputsDir, entry.name);
          const manifest = await this.read(batchDir);
          if (manifest) {
            manifests.push(manifest);
          }
        }
      }

      return manifests.sort((a, b) => {
        const timeA = a.submittedAt ?? "";
        const timeB = b.submittedAt ?? "";
        return timeB.localeCompare(timeA);
      });
    } catch {
      return [];
    }
  }
}

/**
 * 创建 manifest 的工厂函数。
 */
export function createManifest(params: {
  taskId: string;
  title: string;
  slug: string;
  status: TaskStatus;
  lyricsSha256: string;
  styleSha256: string;
  clipCount?: number;
}): Manifest {
  const clipCount = params.clipCount ?? 2;

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    taskId: params.taskId,
    title: params.title,
    slug: params.slug,
    status: params.status,
    submittedAt: new Date().toISOString(),
    suno: {
      clipIds: [],
    },
    inputs: {
      lyricsSha256: params.lyricsSha256,
      styleSha256: params.styleSha256,
    },
    tracks: Array.from({ length: clipCount }, (_, i) => ({
      index: i + 1,
      status: "pending" as const,
    })),
    warnings: [],
  };
}
