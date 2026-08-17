import type { AlbumBrief, AlbumPlan, TrackSlot } from "../domain/album-brief.js";
import { AlbumBriefSchema } from "../domain/album-brief.js";
import { ErrorCodes } from "../domain/errors.js";
import { err, ok, type ResultEnvelope } from "../shared/result.js";

export interface DesignAlbumOutput {
  plan: AlbumPlan;
  /** 按此规划可生成的专辑 Markdown 草稿 */
  markdownTemplate: string;
}

/**
 * 专辑概念设计 — 将用户的 AlbumBrief 展开为逐曲目的创作规划。
 *
 * 本函数是确定性的：根据 Brief 中的约束（trackDirections / genre / instruments 等），
 * 为每首曲目生成一个 TrackSlot 槽位，Agent 按 Slot 描述填充歌词和 Style。
 *
 * 如果 Brief 提供了 trackDirections，按提供的顺序分配主题；
 * 否则用 `[主题待规划]` 标记，由 Agent 在生成阶段补充。
 */
export function designAlbum(input: AlbumBrief): ResultEnvelope<DesignAlbumOutput> {
  const parsed = AlbumBriefSchema.safeParse(input);
  if (!parsed.success) {
    return err(ErrorCodes.ALBUM_INVALID_MARKDOWN, `概念校验失败: ${parsed.error.message}`);
  }

  const brief = parsed.data;
  const warnings: string[] = [];

  if (!brief.trackDirections || brief.trackDirections.length === 0) {
    warnings.push("未提供 trackDirections，Agent 将自动为每首曲目规划主题");
  }

  const tracks: TrackSlot[] = [];
  for (let i = 0; i < brief.trackCount; i += 1) {
    const index = i + 1;
    const theme = brief.trackDirections?.[i] || `[待 Agent 规划曲目 ${index} 的主题]`;
    const moodHint = brief.mood ? `，情绪: ${brief.mood}` : "";
    const instHint = brief.instruments && brief.instruments.length > 0
      ? `，乐器: ${brief.instruments.join("、")}`
      : "";

    tracks.push({
      index,
      theme,
      styleDirection: `${brief.genre}${moodHint}${instHint}${brief.productionNotes ? `，制作: ${brief.productionNotes}` : ""}`,
      lyricsPrompt: `语言: ${brief.lyricsLanguage || "中文"}。主题: ${theme}。${brief.lyricsStructure ? `结构: ${brief.lyricsStructure}。` : ""}请生成一首完整的歌词，包含技术标签（如 [Verse 1]、[Chorus] 等）。`,
      vocalNotes: brief.vocalStyle || undefined,
    });
  }

  const plan: AlbumPlan = {
    title: brief.title,
    trackCount: brief.trackCount,
    genre: brief.genre,
    instruments: brief.instruments || [],
    mood: brief.mood,
    lyricsLanguage: brief.lyricsLanguage || "中文",
    lyricsStructure: brief.lyricsStructure,
    productionNotes: brief.productionNotes,
    tracks,
    additionalNotes: brief.additionalNotes,
  };

  const markdownTemplate = buildMarkdownTemplate(plan);

  return ok({ plan, markdownTemplate }, warnings);
}

function buildMarkdownTemplate(plan: AlbumPlan): string {
  const lines: string[] = [`# ${plan.title}`];

  if (plan.mood || plan.genre) {
    const desc: string[] = [];
    if (plan.genre) desc.push(`曲风: ${plan.genre}`);
    if (plan.mood) desc.push(`情绪: ${plan.mood}`);
    if (plan.instruments.length > 0) desc.push(`乐器: ${plan.instruments.join("、")}`);
    lines.push(desc.join("。"));
  }

  for (const track of plan.tracks) {
    lines.push("");
    lines.push(`## 曲目 ${track.index}：[待填写歌名]`);
    lines.push("");
    lines.push("### 歌词");
    lines.push("");
    lines.push("[待 Agent 生成完整歌词]");
    lines.push("");
    lines.push("### Style");
    lines.push("");
    lines.push(`[基于: ${track.styleDirection}]`);
    lines.push("");
    lines.push("### 歌名");
    lines.push("");
    lines.push("[待填写]");
    lines.push("");
    lines.push("### 不含技术词的歌词");
    lines.push("");
    lines.push("[待 Agent 提取]");
  }

  return lines.join("\n") + "\n";
}
