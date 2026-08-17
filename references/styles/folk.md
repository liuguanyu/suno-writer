# 民谣制作指南

在用户要求 Folk、民谣、Singer-Songwriter、Folk Rock、Americana、Contemporary Folk 或木吉他叙事时读取，同时遵守 `../suno-tags.md`。乡村读取 `country.md`，独立民谣读取 `indie.md`。

> 证据边界：Suno 官方 glossary 把 Folk 列为音乐词汇（原声、叙事、简单编配），但子流派细节与 prompt 组合是社区经验，非官方契约。

## 核心特征

民谣以原声吉他（指弹/扫弦）、温暖人声、叙事性歌词和简洁编配为核心，强调真诚与讲述感。

## Style 模板

```text
folk, acoustic guitar, fingerpicking, warm storytelling vocal,
minimal arrangement, gentle melody, intimate atmosphere
```

可替换方向：

- Singer-Songwriter：`singer-songwriter, acoustic guitar, confessional vocal, sparse`
- Folk Rock：`folk rock, acoustic and electric guitars, full band, harmony vocals`
- Americana：`americana, roots instruments, pedal steel, warm organic production`
- Contemporary Folk：`contemporary folk, fingerpicked guitar, breathy vocal, soft strings`
- Traditional Folk：`traditional folk, simple melody, communal feel, handclaps optional`

## 段落模板

```text
[Intro: fingerpicked acoustic guitar motif]
[Verse 1: warm vocal, storytelling, sparse accompaniment]
[Chorus: melody opens up, light harmony vocals]
[Verse 2: same structure, slight instrumental variation]
[Bridge: gentle lift, strings or harmony enter]
[Outro: return to intro motif, fade on acoustic guitar]
```

民谣的简洁是关键；避免堆太多乐器破坏亲近感。

## 人声与歌词

- 人声温暖、真诚、靠前：写 `warm vocal`、`intimate vocal`。
- 歌词以叙事与情感细节为主，副歌可更旋律化。
- `fingerpicking`、`acoustic guitar`、`pedal steel` 是概率性音色 cue。

## 常见失败与降级

- **变成普通流行**：加强 `acoustic guitar`、`minimal arrangement`、`storytelling`。
- **编配过满**：删减弦乐/鼓，回到木吉他与人声。
- **变成乡村**：弱化 `twang`、`train beat`，回到温暖叙事与简洁原声。

## 资料与可信度

- Suno 官方 glossary 将 Folk 列为原声、叙事、简单编配的音乐词汇。
- 社区教程与 AI 概览：`fingerpicking`、`storytelling vocal`、`minimal arrangement` 等是经验性写法。
