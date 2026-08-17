# Synthpop 制作指南

在用户要求 Synthpop、合成器流行、80s Pop、New Wave 或明亮复古电子流行时读取，同时遵守 `../suno-tags.md`。若需求偏重 Build/Drop/Breakdown，先读取 `electronic.md`；若偏重无字人声，再读取 `wordless-vocals.md`。

> 证据边界：Synthpop 是 Suno 官方 glossary 之外的经验性风格词，社区 prompt 是概率性方向，BPM 等是方向提示而非精确锁定。

## 核心特征

Synthpop 以合成器主导、旋律清晰、明亮上口为核心，通常带 80 年代鼓机质感和强烈 hook，比 Synthwave 更偏歌曲结构，比 City Pop 更冷峻和电子化。

## Style 模板

```text
synthpop, 1980s synth-pop, bright analog synths, driving drum machine,
catchy melodic hook, euphoric and nostalgic, 118 BPM feel
```

可替换方向：

- 更冷峻/新浪潮：`new wave synthpop, angular synths, crisp snare, detached vocal`
- 更温暖/浪漫：`romantic synthpop, lush pads, soft arpeggios, airy vocal`
- 更忧郁：`melancholic synthpop, minor-key hooks, spacious reverb`
- 更梦幻：`dreamy synthpop, shimmering pads, breathy vocal, gentle pulse`

## 段落模板

```text
[Intro: bright synth arpeggio, drum machine enters]
[Verse 1: intimate vocal over pulsing bass and sparse synths]
[Pre-Chorus: rising pad, harmony opens, tension builds]
[Chorus: catchy synth hook, layered vocal harmonies]
[Bridge: synth solo, stripped drums, emotional lift]
[Final Chorus: fuller layers, strongest hook, decisive ending]
```

## 人声与歌词

- 副歌优先写短而清晰的旋律句，便于形成 hook。
- 主歌可略口语化，但仍保持节奏感。
- `vocal chops`、`vocoder`、`heavy auto-tune` 是概率性制作方向，不是稳定音色锁定。
- 若要求无字，读取 `wordless-vocals.md`，用短元音承担主旋律。

## 常见失败与降级

- **变成 EDM/舞曲**：删除 `drop`、`festival`、`build-up`，改为 `verse-chorus pop structure`、`catchy hook`。
- **旋律不够清晰**：写 `clear lead melody`、`memorable hook`，减少密集音墙。
- **太像 City Pop**：弱化 funk 律动和律动吉他，强调 `drum machine`、`bright analog synths`。
- **太像 Synthwave**：弱化 `driving bassline`、`neon cinematic`，强调歌曲 hook 和明亮旋律。

## 资料与可信度

- Suno 官方 glossary 将 Pop、Electronic/EDM 列为音乐词汇，但未定义 Synthpop 的专属控制语法。
- 社区教程（OpenMusicPrompt、Undetectr 等）：`synth-pop, euphoric and nostalgic, 118 BPM, bright...` 是经验性写法。
