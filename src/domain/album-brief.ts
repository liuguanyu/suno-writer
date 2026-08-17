import { z } from "zod";

/**
 * 专辑创作概念/Brief — 用户提供的创作需求。
 *
 * 用户可以用自然语言描述，由 Agent 结构化为本模型；
 * 也可以直接提供 JSON 文件。
 */
export interface AlbumBrief {
  /** 专辑名称 */
  title: string;
  /** 预期曲目数（最少 2 首） */
  trackCount: number;
  /** 曲风/流派描述（中文或英文均可） */
  genre: string;
  /** 整体情绪/氛围 */
  mood?: string;
  /** 推荐使用的乐器列表 */
  instruments?: string[];
  /** 专辑主题/概念描述 */
  theme?: string;
  /** 歌词语言（默认中文） */
  lyricsLanguage?: string;
  /** 歌词结构要求（如 "每首 Verse-Chorus-Verse-Chorus-Outro"） */
  lyricsStructure?: string;
  /** 演唱要求（如 "男女对唱各 2 首"、"童声合唱"） */
  vocalStyle?: string;
  /** 制作/混音偏好 */
  productionNotes?: string;
  /** 每首曲目的主题/方向建议（按顺序，数量应与 trackCount 一致） */
  trackDirections?: string[];
  /** 补充说明 */
  additionalNotes?: string;
}

export const AlbumBriefSchema = z.object({
  title: z.string().min(1, "专辑名不能为空"),
  trackCount: z.number().int().min(2, "至少需要 2 首曲目").max(30, "最多 30 首曲目"),
  genre: z.string().min(1, "曲风不能为空"),
  mood: z.string().optional(),
  instruments: z.array(z.string()).optional(),
  theme: z.string().optional(),
  lyricsLanguage: z.string().optional(),
  lyricsStructure: z.string().optional(),
  vocalStyle: z.string().optional(),
  productionNotes: z.string().optional(),
  trackDirections: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
}).refine(
  (brief) => !brief.trackDirections || brief.trackDirections.length === brief.trackCount,
  { message: "trackDirections 数量必须与 trackCount 一致" },
);

/**
 * 单首曲目的规划槽位 — 在概念设计阶段确定每首歌的方向，
 * 由 Agent 填写具体的歌词和 Style。
 */
export interface TrackSlot {
  /** 曲目序号（从 1 开始） */
  index: number;
  /** 曲目方向/主题（来自 brief.trackDirections 或由 Agent 规划） */
  theme: string;
  /** 建议的 Style 方向（Agent 根据 brief.genre + instruments + 该曲目主题合成） */
  styleDirection: string;
  /** 歌词创作要点 */
  lyricsPrompt: string;
  /** 建议的演唱方式 */
  vocalNotes?: string;
}

/**
 * 专辑规划 — 将 AlbumBrief 展开为逐曲目的创作指南，
 * Agent 按此规划逐曲生成完整歌词和 Style。
 */
export interface AlbumPlan {
  /** 专辑名称 */
  title: string;
  /** 曲目数 */
  trackCount: number;
  /** 曲风 */
  genre: string;
  /** 乐器列表 */
  instruments: string[];
  /** 整体情绪 */
  mood?: string;
  /** 歌词语言 */
  lyricsLanguage: string;
  /** 歌词结构 */
  lyricsStructure?: string;
  /** 制作偏好 */
  productionNotes?: string;
  /** 逐曲目规划槽位 */
  tracks: TrackSlot[];
  /** 补充说明 */
  additionalNotes?: string;
}
