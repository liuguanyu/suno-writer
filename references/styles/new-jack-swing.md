# New Jack Swing 制作指南

在用户要求 New Jack Swing、NJS、Swingbeat、Teddy Riley 式、Jimmy Jam & Terry Lewis 式，或点名 Janet Jackson、Bobby Brown、Bell Biv DeVoe、Guy、Keith Sweat、Michael Jackson（Dangerous 时期）等风格时读取，同时遵守 `../suno-tags.md`。若需求偏重经典 R&B/Neo-Soul，先读取 `r-and-b.md`；若偏重说唱，再读取 `rap.md`；若偏重放克，再读取 `funk.md`。

> 证据边界：New Jack Swing 是 Suno 官方 glossary 之外的年代/融合流派描述词，社区 prompt 是概率性方向，BPM 等是方向提示而非精确锁定。

## 核心特征

New Jack Swing 是 80 年代末到 90 年代初的 R&B/嘻哈/放克融合，核心是 swingbeat——硬朗的鼓机摇摆节拍、swung hi-hats、采样 break、scratch、funk 感 synth bass 与 punchy synth stabs；主唱为 R&B 旋律型人声，穿插 rap 段落与呼应式和声，整体明快、舞曲化、派对感强。区别于现代 R&B 的氛围化留白，New Jack Swing 更硬朗、更律动、更热闹。

## Style 模板

```text
new jack swing, swingbeat, punchy drum machine, swung hi-hats,
funky synth bass, syncopated synth stabs, R&B lead vocal,
rap verses with sung chorus, upbeat danceable groove, 108 BPM feel
```

可替换方向：

- 更硬朗嘻哈：`hard-hitting new jack swing, sampled breaks, DJ scratches, rhythmic rap flow`
- 更放克/R&B：`funk-infused new jack swing, slap bass, horn stabs, smooth R&B vocal`
- 更舞曲化：`danceable new jack swing, four-on-the-floor, anthemic hook, party energy`
- 更丝滑/浪漫：`smooth new jack swing ballad, warm Rhodes, soft harmonies, mid-tempo groove`

避免把 `swingbeat` 与 `minimal futuristic R&B`、`aggressive drill` 同时设为主方向。

## 段落模板

```text
[Intro: punchy drum machine and synth stabs, DJ scratch]
[Verse 1: rhythmic R&B vocal over swung groove and synth bass]
[Pre-Chorus: horns enter, backing harmonies build, tension rising]
[Chorus: catchy sung hook, layered harmonies, danceable swing]
[Bridge: rap interlude or call-and-response over stripped beat]
[Final Chorus: fuller harmonies, strongest hook, party ending]
```

## 人声与歌词

- 副歌优先写短而清晰的旋律句，配合 rap 段落形成反差。
- 主歌可偏口语化，保持节奏感与切分。
- rap 段落写清楚是 spoken/rapped，避免与主唱旋律混淆；可写 `sung chorus, rap verses`。
- 呼应式和声（call-and-response）放在桥段或副歌，写短回应，避免长句重叠。
- 转音规则读取 `vocal-techniques.md`。

## 常见失败与降级

- **变成普通 90s Pop**：加强 `swingbeat`、`punchy drum machine`、`funky synth bass`、`synth stabs`，减少泛化的 `catchy pop anthem`。
- **鼓机失去摇摆感**：写 `swung hi-hats`、`syncopated swingbeat`，避免 `straight four-on-the-floor`（除非刻意舞曲化）。
- **太像现代 Trap R&B**：强调 `punchy drum machine`、`funk synth bass`、`horn stabs`，弱化 `808`、`airy pads`、`dark ambience`。
- **rap 与主唱串线**：写 `sung chorus, rap verses`，段落间明确切换。

## 资料与可信度

- Suno 官方 glossary 将 R&B、Hip-Hop 列为音乐词汇，但未定义 New Jack Swing 的专属控制语法。
- 社区教程（HookGenius、SunoPrompt 等）中 `new jack swing, swingbeat, punchy drum machine, swung hi-hats` 等组合是经验性写法，不是官方契约。
