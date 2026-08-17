/**
 * resume 命令 — 恢复未完成的批次。
 *
 * CLI 层：只负责参数解析和调用应用用例。
 *
 * 认证凭证通过 --bearer-token、--browser-token、--device-id 传入，
 * 由 Agent 从浏览器捕获后传递。
 */
import { parseArgs } from "./index.js";
import { resumeBatch } from "../application/resume-batch.js";
import { InMemoryAuthContext } from "../adapters/suno-http/transient-auth.js";
import { SunoHttpGenerationReader } from "../adapters/suno-http/generation-status-client.js";
import { SunoHttpWavConverter } from "../adapters/suno-http/wav-conversion-client.js";
import { StreamDownloader } from "../adapters/filesystem/stream-downloader.js";
import { JsonManifestStore } from "../adapters/filesystem/json-manifest-store.js";
import type { ResultEnvelope } from "../shared/result.js";

export async function runResume(args: string[]): Promise<ResultEnvelope<unknown>> {
  const parsed = parseArgs(args);
  if (!parsed.ok) return parsed;

  const batchDir = parsed.data.input;
  const options = parsed.data.options;

  // Agent 从浏览器捕获的认证凭证
  const bearerToken = options["bearer-token"] || undefined;
  const browserToken = options["browser-token"] || undefined;
  const deviceId = options["device-id"] || undefined;

  const auth = new InMemoryAuthContext();
  if (bearerToken || browserToken || deviceId) {
    auth.setTokens({ bearerToken, browserToken, deviceId });
  }

  const reader = new SunoHttpGenerationReader();
  const converter = new SunoHttpWavConverter();
  const downloader = new StreamDownloader();
  const manifestStore = new JsonManifestStore();

  return resumeBatch({
    batchDir,
    auth,
    reader,
    converter,
    downloader,
    manifestStore,
  });
}
