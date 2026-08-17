/**
 * 生成状态查询客户端 — §10.3 §14
 *
 * 通过 Suno feed/v3 接口查询 clip 生成状态。
 *
 * 适配器实现：只负责对 feed/v3 的 HTTP 调用和响应解析。
 */
import { ok, err, type ResultEnvelope } from "../../shared/result.js";
import { ErrorCodes } from "../../domain/errors.js";
import {
  FeedResponseSchema,
  type FeedResponse,
  type FeedQueryRequest,
} from "../../domain/generation.js";
import type { GenerationReader } from "../../ports/generation-reader.js";
import type { TransientAuthContext } from "../../ports/transient-auth-context.js";
import { InMemoryAuthContext } from "./transient-auth.js";

const FEED_URL = "https://studio-api-prod.suno.com/api/feed/v3";

export class SunoHttpGenerationReader implements GenerationReader {
  async queryStatus(
    request: FeedQueryRequest,
    auth: TransientAuthContext,
  ): Promise<FeedResponse> {
    const authCtx = auth as InMemoryAuthContext;

    const response = await fetch(FEED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authCtx.getHeaders(),
      },
      body: JSON.stringify({
        filters: {
          ids: {
            presence: "True",
            clipIds: request.clipIds,
          },
        },
        limit: request.limit,
      }),
    });

    if (response.status === 401) {
      throw new Error("Suno 认证失效 (401)，请重新登录");
    }

    if (!response.ok) {
      throw new Error(
        `查询生成状态失败: HTTP ${response.status} ${response.statusText}`,
      );
    }

    const raw = await response.json();
    const result = FeedResponseSchema.safeParse(raw);

    if (!result.success) {
      throw new Error(
        `Feed 响应格式变化: ${result.error.message}`,
      );
    }

    return result.data as FeedResponse;
  }
}

export async function safeQueryStatus(
  reader: GenerationReader,
  request: FeedQueryRequest,
  auth: TransientAuthContext,
): Promise<ResultEnvelope<FeedResponse>> {
  try {
    const response = await reader.queryStatus(request, auth);
    return ok(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("401")) {
      return err(ErrorCodes.AUTH_UNAUTHORIZED, message);
    }

    return err(ErrorCodes.GENERATION_FAILED, message);
  }
}
