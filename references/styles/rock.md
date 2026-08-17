# 摇滚制作指南

在用户要求 Rock、摇滚、经典摇滚、硬摇滚、Arena Rock、另类摇滚、独立摇滚或 Garage Rock 时读取，同时遵守 `../suno-tags.md`。朋克、后朋、后摇、金属各有专题文件（`punk.md`、`post-punk.md`、`post-rock.md`、`metal.md`），不要在本文件重复维护。

> 证据边界：Suno 官方 glossary 把 Rock 列为音乐词汇（吉他驱动、强 backbeat），但子流派细节和 prompt 组合是社区经验，BPM 和音色是方向提示。

## 先锁定子流派

不要只写 `rock`。优先明确：子流派、吉他音色、鼓组、节奏感和人声。

```text
classic rock, warm overdriven guitar riffs, steady backbeat,
gritty male vocal, driving bass, live band energy, 120 BPM feel
```

可替换方向：

- 经典摇滚：`classic rock, blues-based guitar, live rhythm section, raspy vocal`
- 硬摇滚：`hard rock, distorted power chords, punchy drums, strong hook`
- Arena Rock：`arena rock, anthemic chorus, big drums, stadium reverb`
- 另类摇滚：`alternative rock, angular guitar, dynamic shifts, introspective vocal`
- 独立摇滚：`indie rock, jangly guitars, lo-fi warmth, conversational vocal`
- Garage Rock：`garage rock, raw fuzz guitar, loose drums, urgent energy`

## 段落模板

```text
[Intro: overdriven guitar riff, drums and bass lock in]
[Verse 1: restrained groove, clear vocal, rhythmic phrasing]
[Pre-Chorus: tension rises, guitars open up]
[Chorus: anthemic hook, full band, layered backing vocals]
[Bridge: breakdown or key change, emotional lift]
[Final Chorus: strongest delivery, extended outro riff]
```

## 人声与歌词

- 副歌使用短而有力的 hook，主歌可更叙事。
- 要合唱式副歌写 `gang vocal chorus` 或 `layered backing vocals`，但朋克/后朋语境下更常见。
- `raspy vocal`、`gritty vocal` 是方向，不保证稳定音色。

## 常见失败与降级

- **太像流行摇滚**：加强 `distorted guitars`、`live band energy`，减少 `polished pop production`。
- **吉他不够突出**：写 `guitar-driven`、`prominent riff`。
- **变成金属**：弱化 `double-kick`、`heavy distortion`，回到 `classic rock groove`。
- **变成后摇**：减少长段 instrumental build，保留歌曲结构 hook。

## 资料与可信度

- Suno 官方 glossary 将 Rock 列为吉他驱动、强 backbeat 的音乐词汇。
- 社区教程（Undetectr、HookGenius 等）：`classic rock, blues-based guitar, live rhythm section` 等是经验性写法。
