/**
 * Generation Reader 端口 — §10.3 §14
 *
 * 负责查询 Suno 生成状态。
 * 适配器：Suno HTTP feed/v3。
 */
import type { FeedResponse, FeedQueryRequest } from "../domain/generation.js";
import type { TransientAuthContext } from "./transient-auth-context.js";

export interface GenerationReader {
  /**
   * 查询指定 clip 的生成状态。
   */
  queryStatus(
    request: FeedQueryRequest,
    auth: TransientAuthContext,
  ): Promise<FeedResponse>;
}
