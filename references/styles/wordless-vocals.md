# 无字歌与 Wordless Vocal 编配指南

在用户要求无字歌、无词歌、哼唱、吟唱、vocalise、wordless vocal、无语义人声或人声作为乐器时读取，同时遵守 `../suno-tags.md`。若要求严格无乐器，再额外读取 `acapella.md`；若要求完全没有人声，应改为纯器乐目标，不读取本文。

## 概念边界

不要混淆：

- **Wordless vocal / Vocalise**：有人声旋律，但不唱具有语义的歌词；可以有器乐伴奏。
- **A cappella**：没有器乐伴奏，但可以唱有语义的歌词；读取 `acapella.md`。
- **Instrumental**：没有主唱或歌词，通常也不应出现 wordless choir、humming 等人声主线。
- **Vocal texture**：人声作为 pad、氛围层或短采样，不一定承担主旋律。

用户只说“无字歌”时，默认理解为 **wordless vocal with instrumental arrangement**；若“是否允许器乐/是否允许人声”会影响核心结果，应在创作前确认。

## 无字人声材料

按清晰度和语义风险由低到高选择：

1. 持续元音：`ah`、`oh`、`ooh`、`mm`。
2. 哼唱：`humming`、`closed-mouth humming`。
3. Vocalise：元音和无意义音节组成的旋律，如 `la`、`na`、`ya`。
4. Scat：爵士式即兴拟声音节，节奏和音高更复杂。
5. Chant / invented syllables：可能被模型理解成有语义语言，风险最高。

若要求真正“无字”，避免写完整句子、旁白、可辨识单词或容易形成语义的连续音节。技术说明只放在方括号标签中，不把自然语言编配描述放进演唱区。

## Style 模板

### 电影感无字女声

```text
cinematic wordless vocalise, ethereal female lead singing open vowels,
slow orchestral build, warm strings, distant French horns,
spacious hall reverb, no semantic lyrics, emotional melodic arc
```

### 氛围电子无字人声

```text
ambient electronic, breathy wordless female vocal texture,
evolving synth pads, granular shimmer, slow pulse,
minimal percussion, spacious and meditative
```

### 世界音乐式吟唱

```text
world-fusion wordless vocalise, expressive solo voice using non-lexical syllables,
frame drum pulse, bowed drone, bamboo flute responses,
organic spacious production
```

### 无字合唱

```text
wordless mixed choir, sustained open-vowel harmony,
clear soprano melody above warm SATB support,
slow cinematic dynamics, orchestral accompaniment
```

`no semantic lyrics`、`non-lexical syllables` 是方向提示，不保证模型绝不生成类似单词的音节。

## Lyrics 区写法

Suno 仍需要结构与可演唱材料时，直接写出期望发声，不要只写 `[Wordless]` 后留空：

```text
[Intro: distant closed-mouth humming, sparse strings]
Mm— mm—

[Verse 1: solo wordless vocalise, gentle and legato]
Ooh— ah—
La— ah— ooh—

[Chorus: full wordless choir, open vowels, clear melody on top]
Ah— ah— ooh—
Ah— ooh— ah—

[Bridge: solo voice and flute call and response, no semantic lyrics]
Ooh—
Ah— ya—

[Final Chorus: wider SATB harmony, sustained vowels, emotional peak]
Ah— ooh— ah—

[Outro: humming fades with the final string chord]
Mm—
```

实际要唱出的音节保留在歌词中。`[no lyrics]`、`[instrumental]` 与具体元音行同时出现可能造成冲突，不要混用。

## 编配策略

### 主唱型无字歌

把人声当主旋律乐器：

- Style 写 `wordless vocal lead`、音色和总体旋律性格。
- Verse 以独唱或单一元音为主。
- Chorus 再加入和声或合唱，不要开场就堆满。
- 器乐用短回应或持续背景，避免与无字主旋律争夺同一音区。

### 氛围型无字人声

把人声当织体：

- 使用 `wordless vocal texture`、`distant choir pad`、`breathy vocal layer`。
- 人声材料保持持续音、短动机和较低密度。
- 若主旋律由乐器承担，明确 `instrumental lead remains dominant`。

### 合唱型无字歌

- 简单副歌优先 `homophonic harmony`。
- 主旋律必须清楚时写 `clear soprano melody on top, supporting voices remain secondary`。
- Canon、密集对位和复杂音节同时出现风险很高；先按 `../suno-tags.md` 的复调阶梯逐级实验。

## 与其他专题组合

- 无字 A cappella：同时读取 `acapella.md`，删除所有器乐正向词。
- 无字 Gospel：同时读取 `gospel.md`；用 `ah/ooh` 替代语义歌词，保留 call-and-response 与合唱发展。
- 无字 R&B：同时读取 `r-and-b.md` 和需要时的 `vocal-techniques.md`；以 humming、vocalise、短 runs 建立主旋律。
- 无字电子乐：同时读取 `electronic.md`；区分完整 `wordless vocal lead` 与切碎的 `vocal chops`。
- 无字氛围摇滚：同时读取 `ambient-rock.md`；人声可作为远景层或高潮合唱。
- 民族音色无字吟唱：同时读取 `uncommon-instruments.md`；不要假借或捏造真实语言、宗教唱词和特定族群仪式文本。

## 常见失败与降级

- **模型唱出完整单词或句子**：删除所有语义文本，只保留短元音；加强 `non-lexical syllables, no semantic lyrics`。
- **技术标签被唱出**：减少 bracket 描述，把全局方向移入 Style，Lyrics 只保留标准段落和发声音节。
- **变成纯器乐**：在 Style 明确 `prominent wordless vocal lead`，并在每个主要段落写出可唱元音。
- **人声只是背景 pad**：明确 `voice carries the main melody`，减少竞争性的器乐主奏。
- **音节过于重复**：只增加 2–3 组元音变化，或加入 `gentle melodic vocalise`；不要写成长段伪语言。
- **转音过密、像炫技练习**：改为 `legato sustained vowels, restrained ornamentation`。
- **合唱含混**：降为齐唱、同节奏三/四部和声，或短 call-and-response。

## 验收点

试听时记录：

1. 是否出现可辨识语义歌词；
2. 人声是主旋律还是背景织体；
3. 元音、哼唱、scat 是否符合目标；
4. 人声与器乐是否争抢音区；
5. 和声、复调和转音是否遮蔽主线；
6. 若要求 A cappella，是否混入真实器乐。

无字歌不是“空 Lyrics”。为提高人声出现概率，通常应提供少量可演唱的无语义音节和清晰的段落结构。
