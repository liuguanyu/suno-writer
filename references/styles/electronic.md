# 电子音乐制作指南

在用户要求 Electronic、EDM、House、Techno、Trance、Drum and Bass、Glitch、Future Bass 等舞曲/电子音乐时读取，同时遵守 `../suno-tags.md`。Synthwave、Synthpop、City Pop、Vaporwave 等复古合成器流派请读取各自的专题文件（`synthwave.md`、`synthpop.md`、`city-pop.md`、`vaporwave.md`），不要在本文件重复维护。

## 先锁定子流派与律动

不要只写 `electronic music`。优先明确：子流派、速度感、鼓组、低频、主合成器、人声与空间。

```text
melodic progressive house, 124 BPM feel, four-on-the-floor kick,
warm sidechained pads, clean sub bass, bright pluck arpeggio,
airy female vocal, gradual festival-scale build
```

其他方向：

- Techno：`hypnotic techno, steady four-on-the-floor, rolling bass, sparse vocal fragments`
- Drum and Bass：`liquid drum and bass, fast breakbeats, deep sub bass, atmospheric pads`
- Glitch：`experimental glitch electronic, granular textures, stuttering edits, asymmetric percussion`
- Ambient electronic：`beatless ambient electronic, evolving pads, granular shimmer, slow harmonic motion`

BPM 是方向提示，不是精确锁定。

## 段落模板

```text
[Intro: filtered pad and distant vocal texture, gradual fade-in]
[Verse 1: reduced beat, intimate lead over pulsing bass]
[Build: percussion layers enter, filter opens, tension rising]
[Drop: full kick and bass, primary synth hook, minimal lyrics]
[Breakdown: drums drop out, spacious vocal and evolving pad]
[Final Drop: wider synth layers, stronger bass, concise variation]
[Outro: elements filter away, delay tail remains]
```

`Build`、`Drop`、`Breakdown` 比精确“32 小节后 drop”更可靠。不要把精确自动化曲线、sidechain 参数或插件名当成可控契约。

## 人声与歌词

- Drop 段歌词应短，给主 synth hook 留空间。
- 要 vocal chops 时写 `short chopped vocal texture`，但可能生成不可辨识音节。
- 要完整主唱时避免同时要求全段密集 glitch/stutter。
- `heavy auto-tune`、`vocoder`、`formant-shifted vocal` 是概率性制作方向。

## 常见失败与降级

- **子流派混乱**：保留一个主子流派，删除互相冲突的鼓型。
- **Drop 不明显**：缩短歌词，明确 `drums drop out` 后再 `full kick and bass enter`。
- **声音过满**：改为 `sparse arrangement, one primary synth hook`。
- **氛围电子出现强鼓**：明确 `beatless`、`no drums`，并移除 `EDM/drop` 等冲突词。
