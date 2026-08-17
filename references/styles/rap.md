# Rap 与 Hip-Hop 制作规范

本文件只在用户要求 Rap、Hip-Hop、说唱、flow 或 cadence 时读取，同时遵守 `../suno-tags.md`。若要求 A cappella Rap，再额外读取 `acapella.md`。

> 证据边界：Suno 官方 Music Glossary 把 `Rapping` 定义为有节奏的 spoken/chanted lyrics，并建议使用具体的 tempo、rhythm、structure 和 vocal-technique 词汇；官方没有承诺精确 BPM、每小节音节数或 flow 锁定。下面的歌词组织和降级策略主要来自社区经验。

## Style 的职责

Style 描述整首歌的声音框架，建议先固定一个主要变量：

```text
Chinese boom-bap hip-hop, 92 BPM feel, dry male rap vocal, tight rhythmic cadence,
punchy kick and snare, warm bass, clear diction, memorable spoken hook
```

可按目标替换：

- 流派/律动：`boom-bap`、`trap`、`drill`、`old-school hip-hop`、`jazz rap`、`conscious hip-hop`
- 速度感：`slow half-time`、`mid-tempo`、`fast double-time passages`
- 说唱方式：`spoken rap`、`tight rhythmic delivery`、`conversational flow`、`commanding cadence`
- 人声：`clear diction`、`dry vocal`、`gritty baritone`、`restrained ad-libs`
- 结构：`verse-driven with a short chant hook`、`call-and-response chorus`

`92 BPM` 等是方向提示，不是节拍锁定。不要同时要求多种 flow、复杂声部、精确速度变化和密集歌词；先验证单一 flow，再做变体。

## Lyrics 的职责

歌词通过行长、断句、重复和段落结构给 flow 提供可读的节奏骨架：

```text
[Intro: spoken pickup, dry vocal]
一句短引子，留出呼吸。

[Verse 1: tight rhythmic rap, clear diction]
短句，重音落在句尾，保持呼吸。
每行一个主要意群，别塞太多从句。
逗号提示短暂停顿，句号提示句尾收束。

[Hook: repetitive chant, short memorable phrases]
有用，有趣，有料，有脑！
有用，有趣，有料，有脑！

[Verse 2: conversational flow, restrained ad-libs]
主句保持清楚（yeah）
回应只保留短词（短词）

[Bridge: spoken word, half-time feel]
放慢语流，留出空白。

[Final Hook: stronger delivery, layered backing chant]
有用，有趣，有料，有脑！
```

社区常见经验是让每行长度相近、以标点组织停顿，并直接写出要重复的 hook；这些做法可能帮助节奏稳定，但不是 Suno 的正式计谱语法。中文歌词不要机械追求固定音节数，优先保证自然重音、可呼吸和句尾韵脚。

## Flow 实验顺序

1. `spoken rap` + 短行：先确认模型不把主歌唱成抒情旋律。
2. 固定段落后只改为 `conversational flow` 或 `tight rhythmic cadence`。
3. 再单独实验 `double-time` 或 `half-time`，不要同时改 BPM、押韵密度和配器。
4. 需要旋律副歌时明确 `rap verses, sung hook`；需要全曲说唱时写 `rapping throughout, minimal melodic singing`。
5. 生成后试听检查：是否被唱成旋律、是否吞字、是否抢拍、ad-lib 是否盖住主句。

`technical rap` 可能只让歌词更密，不等于精准 flow；`fast rap` 也可能造成吞字。若清晰度优先，用 `moderate pace, clear diction, controlled pauses`。

## 常见失败与降级

- **主歌被唱成旋律**：改为 `spoken rap, minimal melodic singing`，缩短行长。
- **吞字或抢拍**：降低速度感、减少每行信息量，使用 `clear diction, controlled pauses`。
- **Hook 不突出**：直接重复短 hook，减少副歌里的长句和 flow 变化。
- **Ad-lib 遮住主句**：将回应缩为 1–3 词，并写 `restrained ad-libs, low in mix`。
- **需要精确 cadence**：使用用户提供的节奏/人声音频参考或 DAW 后期；文本提示不能锁定逐拍 flow。

## 资料与可信度

### 官方

- [Music Glossary for Suno](https://help.suno.com/en/articles/9010177)：定义 Rapping，并建议组合 tempo、rhythm、structure、genre 和 vocal-technique 术语。
- [Can I use my own lyrics?](https://help.suno.com/en/articles/2415873)：Custom mode 可输入自有歌词和上下文；未定义完整 bracket 标签契约。

### 社区线索（非官方契约）

- [SunoAI Reddit：Rap flow 讨论](https://www.reddit.com/r/SunoAI/search/?q=rap%20flow&restrict_sr=1)：可观察 flow、cadence、melodic rap 等经验，但不能作为精确节拍保证。

记录实验时标注模型版本、Style、歌词长度和失败类型；社区 prompt 只能作为候选，不应写成官方支持语法。
