# Y2K 风格制作指南

在用户要求 Y2K、千禧年代流行、2000s Pop/R&B、Teen Pop、Max Martin 式、Timbaland 式，或点名 Britney Spears、*NSYNC、Backstreet Boys、Destiny's Child、Aaliyah、TLC 等风格时读取，同时遵守 `../suno-tags.md`。若需求偏重现代 R&B 氛围，先读取 `modern-r-and-b.md`；若偏重合成器流行，再读取 `synthpop.md`；若偏重说唱融合，再读取 `rap.md`。

> 证据边界：Y2K 是年代/审美标签而非单一流派，需先落到具体子流派（Y2K pop、teen pop、Y2K R&B、dance-pop）。Suno 官方 glossary 没有为 Y2K 发布锁定式语法，社区 prompt 是概率性方向。

## 核心特征

Y2K 指 90 年代末到 2000 年代初光滑、闪亮、带未来科技感的流行/R&B 制作：Max Martin 式密集 hook、Timbaland 式切分节拍与口技/stutter 音效、turntable scratch、闪亮合成器、多层和声、funk 感 bassline，整体明快、上口、带数字未来感。比 Synthpop 更「数字闪亮」，比现代 R&B 更明快和舞曲化。

## Style 模板

```text
Y2K pop, glossy 2000s production, catchy hook, programmed drum machine,
shimmering synths, funk-influenced bassline, layered backing vocals,
energetic and upbeat, polished Max Martin-style arrangement, 120 BPM feel
```

可替换方向：

- 更 Teen Pop：`teen pop, bright melodies, sugar-sweet hooks, bubbly vocal, bouncy beat`
- 更 Y2K R&B：`Y2K R&B, syncopated Timbaland-style beat, stutter vocal chops, deep bass, sleek production`
- 更 Dance-Pop：`Y2K dance-pop, four-on-the-floor, disco strings, anthemic chorus`
- 更未来数字感：`futuristic Y2K, metallic synths, digital effects, turntable scratches, robotic ad-libs`

避免把 `glossy 2000s pop` 与 `modern festival EDM drop` 同时设为主方向。

## 段落模板

```text
[Intro: synth stabs, DJ scratch, drum machine groove]
[Verse 1: confident vocal over funk bassline and tight beat]
[Pre-Chorus: rising synths, backing vocals layer in, anticipation]
[Chorus: catchy anthemic hook, layered harmonies, polished production]
[Bridge: breakdown with digital stutter, vocal ad-libs]
[Final Chorus: full harmonies, strongest hook, decisive ending]
```

## 人声与歌词

- 副歌优先写短而清晰的 hook 句，便于记忆。
- 主歌可更口语化，但保持节奏感。
- 多层和声放在副歌，写 `layered backing vocals`；不要每句都堆。
- 若要 Timbaland 式 stutter/口技，写 `stutter vocal chops`、`vocal percussion ad-libs`，属概率性方向。
- 若要求无字 hook，读取 `wordless-vocals.md`，用短元音承担主旋律。

## 常见失败与降级

- **变成当代 EDM**：删除 `drop`、`festival`、`build-up`，改为 `verse-chorus pop structure`、`catchy hook`。
- **时代感不足**：加强 `glossy 2000s production`、`programmed drum machine`、`funk-influenced bassline`、`DJ scratch`。
- **旋律不够清晰**：写 `clear lead melody`、`memorable hook`，减少密集音墙。
- **太像 80s Synthpop**：弱化 `analog synths` 的冷感，强调 `polished digital production`、`sleek and glossy`。

## 资料与可信度

- Suno 官方 glossary 将 Pop、R&B、Dance 列为音乐词汇，但未定义 Y2K 的专属控制语法。
- 社区教程中 `Y2K pop, glossy 2000s, catchy hook, Max Martin-style` 等组合是经验性写法，不是官方契约。
