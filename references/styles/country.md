# 乡村音乐制作指南

在用户要求 Country、乡村、Country Pop、Outlaw Country、Bluegrass、Alt-Country 或 Americana 时读取，同时遵守 `../suno-tags.md`。民谣读取 `folk.md`。

> 证据边界：Suno 官方 glossary 把 Country 列为音乐词汇，但子流派细节与 prompt 组合是社区经验，非官方契约。精确速度与乐器音色是方向提示。

## 核心特征

乡村以 twang 吉他、踏板钢弦（pedal steel）、小提琴、南方口音人声和 train beat / shuffle 律动为核心，强调叙事与地方感。

## Style 模板

```text
country, twangy electric guitar, pedal steel,
fiddle, southern vocal, train beat, storytelling, warm production
```

可替换方向：

- Classic Country：`classic country, pedal steel, fiddle, honky-tonk piano, storytelling`
- Country Pop：`country pop, polished production, catchy chorus, modern drums`
- Outlaw Country：`outlaw country, raw vocal, driving rhythm, rock influence`
- Bluegrass：`bluegrass, fast acoustic picking, banjo, mandolin, fiddle, high harmony`
- Alt-Country：`alt-country, lo-fi warmth, introspective vocal, roots instrumentation`

## 段落模板

```text
[Intro: pedal steel and acoustic guitar, train beat]
[Verse 1: storytelling vocal, twangy guitar fill]
[Chorus: fuller harmony, fiddle answers, memorable hook]
[Verse 2: same drive, slight instrumental variation]
[Bridge: pedal steel solo, emotional lift]
[Outro: fiddle and steel fade, final vocal line]
```

`train beat`、`pedal steel` 是概率性音色 cue，不保证稳定复现。

## 人声与歌词

- 人声常带南方口音与叙事感：写 `southern vocal`、`storytelling vocal`。
- 歌词以具体场景、地名、生活细节见长，副歌可更直白有力。
- 中文乡村注意口音与咬字，避免过度刻板。

## 常见失败与降级

- **变成普通流行**：加强 `pedal steel`、`fiddle`、`train beat`，减少 `polished pop`。
- **变成民谣**：加入 `twangy guitar`、`southern vocal`、`train beat`，弱化温暖独白感。
- **乐器感不足**：写 `pedal steel`、`fiddle`、`banjo` 作为标志音色。

## 资料与可信度

- Suno 官方 glossary 将 Country 列为音乐词汇。
- 社区教程与 AI 概览：`twangy guitar`、`pedal steel`、`train beat` 等是经验性写法。
