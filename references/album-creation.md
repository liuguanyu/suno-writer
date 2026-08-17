# 专辑创作工作流

仅在规划、创作、修改或校验专辑时读取。若要提交，继续读取 `doctor-workflow.md` 与 `submission-workflow.md`。

## 五阶段流程

### 1. 概念收集

收集并结构化：

- 专辑名称与预期曲目数
- 曲风/流派、情绪/氛围、推荐乐器
- 核心主题或叙事概念
- 歌词语言与结构要求
- 演唱方式、制作和混音偏好
- 每首歌的主题方向（可选；缺失时由模型规划）

将其整理为 AlbumBrief JSON 并让用户审阅。必填字段为 `title`、`trackCount`（至少 2）和 `genre`。

```jsonc
{
  "title": "专辑名称",
  "trackCount": 5,
  "genre": "Chinese Electronic Folk, Ambient",
  "mood": "空灵、沉思、未来感",
  "instruments": ["竹笛", "古筝", "合成器", "808鼓机"],
  "theme": "科技与传统的融合",
  "lyricsLanguage": "中文",
  "lyricsStructure": "Verse 1 - Chorus - Verse 2 - Chorus - Bridge - Outro",
  "vocalStyle": "空灵女声，副歌加入电子和声",
  "productionNotes": "空间混响，民族乐器前置",
  "trackDirections": ["曲目1方向", "曲目2方向"],
  "additionalNotes": "其他补充"
}
```

### 2. 曲目规划

运行：

```bash
pnpm design-album <concept.json> [--output=<album-template.md>]
```

为每个 TrackSlot 确定独立但统一于专辑概念的曲目主题、Style 方向、歌词要点和演唱建议。检查曲目间避免歌名、核心意象、结构和 Style 完全重复，并规划合理的开场、发展与收束。

### 3. 逐曲创作

按计划逐曲完成：

- 凝练且不重复的歌名
- 包含规范、证据分级的技术导演标签：标准 section token 负责结构，每个主要段落只追加 1–3 个高优先级的人声、配器/律动、动态或过渡变化；精确小节数仅作为用户接受的概率性提示
- 英文 Style prompt；标签细化段落执行并与 Style 全曲方向一致
- 从歌词中去除技术标签得到的纯歌词
- 非中文歌词所需的中文翻译

标签规范读取 `suno-tags.md`，输出格式读取 `output-contract.md`。曲目命中具体流派、唱法或特殊配器时，先读取 `styles/index.md`，再只加载该曲需要的专题文件；同一专辑不应因某一曲需要而加载全部专题。不要只使用裸 `[Verse]`、`[Chorus]`，但也不要堆超长描述：保留标准结构词，为主要段落写短而可执行的局部修饰，并设计每首内部的发展弧线。最终整合为一个 album Markdown，而不是多个互不关联的单曲文件。

### 4. 审阅与局部修改

展示完整专辑供用户审阅。用户可修改任意曲目的歌名、歌词或 Style；优先局部调整，不因单曲反馈重写全专辑。修改后确认：

- 曲目编号从 1 连续递增
- 曲目数与 AlbumBrief 一致
- 歌名不重复
- 每首均满足单曲字段契约
- 专辑整体风格统一，曲目又可辨识
- 不同曲目不机械复用同一套标签模板；各自的人声分配、动态弧线、独奏或转场服务其主题
- 标签具体但不过载，同一段内没有互斥的人声、动态或配器指令
- 专辑中所有严格小节数、精确进入点和角色身份要求都标记为概率性控制；验收级精度另行规划编辑/DAW

运行：

```bash
pnpm validate:album <album.md> [--mode=strict|minimal]
```

修复后重新校验，直到通过。

### 5. 提交交接

创作阶段不点击 Create。用户要求提交时：

1. 明确告知每首曲目各对应一次生成提交，通常会生成两个版本并消耗 credits。
2. 获取对准确曲目数的明确确认。
3. 转入 `doctor-workflow.md`，通过后再执行 `submission-workflow.md`。

不得把“同意专辑草稿”解释为“同意消耗 credits”。
