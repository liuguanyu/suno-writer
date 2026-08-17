# 现代 R&B（Contemporary / Alternative R&B）制作指南

在用户要求现代 R&B、Contemporary R&B、Alternative R&B、PBR&B、Trap-Soul、氛围化/暗黑 R&B，或点名 The Weeknd、Frank Ocean、SZA、Bryson Tiller、Brent Faiyaz、6LACK 等风格时读取，同时遵守 `../suno-tags.md`。若需求偏重经典 Soul/Neo-Soul 或丝滑律动，先读取 `r-and-b.md`；若偏重说唱融合，再读取 `rap.md`；若偏重转音，再读取 `vocal-techniques.md`。

> 证据边界：现代 R&B 是 Suno 官方 glossary 之外的时代/子流派描述词，社区 prompt 是概率性方向，BPM 等是方向提示而非精确锁定。

## 核心特征

现代 R&B 以极简、氛围化、低音主导为核心，通常融合 trap 打击乐、深 808、airy pads 与 close-mic 亲密人声，整体缓慢、阴郁、空间感强；主唱为旋律型人声，叠加大量转音、ad-lib 与和声。区别于传统 R&B 的现场乐队感（live rhythm section、Rhodes、organ），现代 R&B 更偏数字制作与留白。

## Style 模板

```text
contemporary R&B, minimalist production, deep sub bass,
sparse trap-influenced drums, airy pads, close-mic intimate vocal,
reverb-drenched atmosphere, moody and melancholic,
slow half-time pocket, 70 BPM feel
```

可替换方向：

- 更 Trap-Soul：`trap-soul, sparse 808, minimal drums, breathy vocal, dark ambient bed`
- 更 Alt-R&B/氛围：`alternative R&B, ethereal pads, spacey reverb, falsetto lead, slow-burning`
- 更旋律流行化：`melodic contemporary R&B, catchy sung hook, smooth harmonies, polished production`
- 更复古灵魂融合：`modern R&B with vintage soul warmth, warm Rhodes, round bass, restrained runs`

避免把 `live soul band`、`minimal futuristic R&B`、`aggressive drill` 同时设为主方向。

## 段落模板

```text
[Intro: airy pad and soft 808 swell, close-mic ad-lib]
[Verse 1: intimate breathy vocal over sparse drums and sub bass]
[Pre-Chorus: pads widen, backing harmonies enter, tension rising]
[Chorus: memorable sung hook, layered harmonies, deeper 808]
[Bridge: stripped to Rhodes and vocal, brief falsetto run]
[Final Chorus: fuller harmony stack, stronger lead, controlled vocal runs]
```

## 人声与歌词

- 主歌偏口语、低语感，给切分和拖拍留空间。
- 副歌用短而可重复的旋律句，配合 falsetto 或 melisma。
- 转音和 ad-lib 直接写成短回应，避免长句和主唱完全重叠。转音规则读取 `vocal-techniques.md`。
- 若要 Trap-Soul 半说半唱，写 `half-sung half-rapped delivery` 或 `melodic rap verses, sung chorus`，避免只写含糊的 `rap R&B`。
- 和声放在副歌加厚，写 `layered harmonies`；不要每句都堆。

## 常见失败与降级

- **变成普通 Pop**：加强 `minimalist production`、`deep sub bass`、`airy pads`、`moody atmosphere`，减少 `catchy pop anthem`。
- **转音过多、咬字不清**：改为 `restrained vocal runs, clear diction`，只在 Bridge 或 Final Chorus 标一次。
- **鼓和 808 太重**：删除 `trap`，改为 `soft syncopated drums, round bass`。
- **太像传统 Neo-Soul**：强调 `sparse trap-influenced drums`、`deep 808`、`reverb-drenched atmosphere`，弱化 `live rhythm section`。
- **和声遮住主唱**：写 `lead remains dominant, backing harmonies low in mix`。

## 资料与可信度

- Suno 官方 glossary 将 R&B 列为音乐词汇，但未定义 Contemporary/Alternative R&B 的专属控制语法。
- 社区教程（HookGenius、SunoPrompt 等）中 `contemporary R&B, minimalist, deep sub bass, airy pads, close-mic vocal` 等组合是经验性写法，不是官方契约。
