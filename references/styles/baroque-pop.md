# 巴洛克流行制作指南

在用户要求 Baroque Pop、巴洛克流行、Chamber Pop、室内流行、Orchestral Pop 或华丽复古编曲流行时读取，同时遵守 `../suno-tags.md`。若偏重电子合成器，读取 `synthpop.md`；若偏重古典/管弦，可结合 `uncommon-instruments.md`。

> 证据边界：Baroque Pop 的 prompt 组合是社区经验，Suno 官方 glossary 未定义专属语法。

## 核心特征

巴洛克流行把古典/室内乐器（羽管键琴、大提琴、小提琴、弦乐四重奏、木管）与流行歌曲结构结合，旋律华丽、编曲精致、带戏剧感和复古宫廷气息。

## Style 模板

```text
baroque pop, chamber pop, ornate melodies, theatrical arrangements,
harpsichord ostinato, cello, violin, warm strings,
clear expressive vocal, refined production
```

可替换方向：

- 更室内：`chamber pop, string quartet, woodwinds, intimate orchestration`
- 更华丽：`orchestral baroque pop, harpsichord, timpani, dramatic swells`
- 更复古 60s：`1960s baroque pop, mellotron, brass, vintage lush production`
- 更现代融合：`modern baroque pop, electronic textures, strings, clean vocal`

## 段落模板

```text
[Intro: harpsichord motif and string swells, ornate]
[Verse 1: expressive vocal over refined chord progression]
[Pre-Chorus: strings rise, woodwinds answer, anticipation]
[Chorus: melodic hook, layered harmonies, full chamber arrangement]
[Bridge: cello and violin counter-melody, theatrical contrast]
[Final Chorus: widest arrangement, decisive cadence]
```

## 人声与歌词

- 主唱清晰、有表现力，副歌可叠加温暖和声。
- 要无字时读取 `wordless-vocals.md`，用元音与哼唱承担华丽旋律。
- 复调/对位规则读取 `../suno-tags.md`，优先 homophonic harmony，避免过度要求独立声部。

## 常见失败与降级

- **变成普通流行**：加强 `harpsichord`、`string quartet`、`theatrical arrangements`。
- **变成古典管弦乐**：保留歌曲结构 hook，明确 `verse-chorus structure`、`pop vocal`。
- **编曲过满**：每段只保留 1–2 个主乐器层。
- **和声混乱**：改为 `clear lead melody, supporting strings remain secondary`。

## 资料与可信度

- 社区教程与 AI 概览：`harpsichord, cello, violin, ornate melodies, theatrical chamber arrangements` 是经验性写法。
