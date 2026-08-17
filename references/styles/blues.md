# 布鲁斯制作指南

在用户要求 Blues、布鲁斯、蓝调、Delta Blues、Chicago Blues、Electric Blues、Blues Rock 或 Shuffle 时读取，同时遵守 `../suno-tags.md`。摇滚读取 `rock.md`，爵士读取 `jazz.md`。

> 证据边界：Suno 官方 glossary 把 Blues 列为音乐词汇（12 小节、布鲁斯音阶、shuffle），但子流派细节与 prompt 组合是社区经验，非官方契约。精确速度与即兴小节数是方向提示。

## 核心特征

布鲁斯以 12 小节结构、布鲁斯音阶、shuffle 律动、呼应式乐句和灵魂感/粗粝感人声为核心。

## Style 模板

```text
blues, 12-bar blues, shuffle rhythm, electric guitar,
soulful gritty vocal, call-and-response, slow burning feel
```

可替换方向：

- Delta Blues：`delta blues, acoustic slide guitar, raw solo vocal, sparse`
- Chicago Blues：`chicago blues, electric guitar, harmonica, driving shuffle`
- Electric Blues：`electric blues, overdriven guitar lead, organ, steady backbeat`
- Blues Rock：`blues rock, distorted guitar riffs, powerful vocal, rock rhythm section`
- Soul Blues：`soul blues, warm horns, gospel-tinged vocal, slow groove`

## 段落模板

```text
[Intro: guitar riff or harmonica over a shuffle groove]
[Verse 1: vocal phrase, guitar or harmonica answers]
[Verse 2: same 12-bar form, varied phrasing]
[Guitar Solo: blues-scale solo over the changes]
[Verse 3: strongest delivery, emotional peak]
[Outro: turnaround, fade on guitar or harmonica]
```

布鲁斯“12 小节”是传统形式，但 Suno 不保证精确小节数，写 `12-bar blues` 作为方向而非硬性保证。

## 人声与歌词

- 人声常带粗粝、灵魂感：写 `gritty vocal`、`soulful vocal`。
- 歌词常用重复与呼应（call-and-response），短句有力。
- `slide guitar`、`harmonica`、`blues scale` 是概率性音色 cue。

## 常见失败与降级

- **变成普通流行**：加强 `12-bar blues`、`shuffle`、`blues scale`，减少 `polished pop`。
- **失去布鲁斯感**：写 `soulful vocal`、`call-and-response`、`guitar lead`。
- **变成摇滚**：弱化 `distorted riffs`、`power chords`，回到 shuffle 与蓝调音阶。

## 资料与可信度

- Suno 官方 glossary 将 Blues 列为 12 小节、布鲁斯音阶与 shuffle 的音乐词汇。
- 社区教程与 AI 概览：`shuffle rhythm`、`call-and-response`、`blues scale` 等是经验性写法。
