# Suno 技术标签与制作导演规范

在创作或检查歌词控制标签时读取。本规范使用清晰的英文音乐词汇引导段落功能、人声、配器、动态和过渡，以提高遵循概率与可控性。

> 重要边界：Suno 是生成模型，不是 DAW、MIDI 编排器或确定性乐谱引擎。详细提示能提高控制力，但不能保证精确执行。方括号 metatag 的完整语法主要来自社区实践；Suno 官方支持使用自有歌词和具体音乐词汇，却没有发布保证每种 bracket 指令执行的正式语法表。

## 专项指南

本文只维护跨风格通用的标签语法、结构、人声分配、和声与复调规则。以下主题包含歌词组织、专项 Style 模板、试听验收和失败降级流程，保持独立以支持渐进读取：

- 指定流派、唱法或特殊配器：先读取 `styles/index.md`，再只加载命中的专题文件。

专项文档仍应遵守本文的标签格式、可靠性分级和“生成控制不是硬保证”等通用边界；不要在通用文档和专题文件中重复维护完整规则。

## 核心原则

1. 技术控制词使用简洁、具体、可演奏的英文描述，并用半角中括号 `[]` 包裹。
2. **制作标签**独立成行；不要与演唱歌词混写。
3. **演唱角色 cue** 可置于歌词行首，例如 `[Lead vocal]`、`[Backing vocals]`、`[Tenor/Bass]`，用于逐句 call-and-response。除此之外的标签不得与歌词同行。
4. 演唱歌词保持用户指定语言。中文全角括号 `（梦想）`、拖音 `梦想～` 等若意图是实际演唱的回声或和声，应保留在歌词中，不视为技术标签。
5. 标签描述“这一段如何演奏/演唱”，Style 描述“整首歌的总体声音”。二者应一致，不互相冲突。
6. 使用足够的控制信息，但不堆叠同义词、矛盾要求或无法在短段落中同时实现的指令。
7. 去除制作标签和角色 cue 后，剩余文本应能作为纯歌词正常阅读。

## 控制可靠性分级

### A 级：优先使用的结构锚点

标准、简短、广泛使用的 section tags 最适合作为结构骨架：

```text
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Bridge]
[Instrumental Break]
[Final Chorus]
[Outro]
```

这些也对应 Suno 官方 glossary 中明确列出的结构概念。它们仍不是绝对保证，但比自造标签稳定。

### B 级：官方词汇支持、概率性执行的音乐方向

Suno 官方建议在 prompts 中组合具体的结构、动态、配器、声乐技巧与制作术语，例如 `crescendo into powerful chorus`、`sparse piano and vocals`、`verse-chorus-verse with extended bridge`。这些方向可以放入 Style；在 Lyrics 中作为简短段落修饰符属于实用但非正式语法：

```text
[Chorus: full choir, richer harmony, crescendo]
[Bridge: sparse piano, intimate vocal, reduced drums]
```

为提高遵循率，每个段落只保留 1–3 个最高优先级变化，避免超长自然语言句子。

### C 级：社区实测、模型相关的角色与演奏 cue

以下写法常被使用，但 Suno 没有正式保证：

```text
[Lead vocal]
[Backing vocals]
[Tenor/Bass]
[Piano Solo]
[Whispered]
[Call and Response]
```

它们适合表达偏好；生成后必须试听验证。对人声身份一致性要求高时，不能只依赖 cue。

### D 级：低可靠性的精确计数与时序

```text
[16-bar Piano Solo]
[4 bars: melodic development]
[enter exactly on beat 3]
[modulate after 32 bars]
```

这些只能作为方向，不能宣称精确控制。若严格小节数、声部进入点、和弦或调制时刻是验收条件，应使用 Suno Studio/音频编辑/DAW 后期实现，而不是依靠一次生成。

## 默认控制密度

除非用户要求极简标签，创作稿默认使用“结构清晰、细节适量”的技术导演稿：

- 用标准 section token 建立骨架。
- 仅在该段确实发生变化时，为标签追加 1–3 个高优先级修饰符。
- 开头可用 `[Intro: ...]` 建立声音场景；全局声音方向优先放 Style，避免 Lyrics 区重复。
- 重复副歌体现一个清晰的发展点，例如 `richer harmonies` 或 `added layered vocals`。
- Bridge 明确一项核心对比；Final Chorus 明确高潮或反高潮；Outro 明确结束方式。
- 器乐独奏优先标注乐器和性格。精确小节数只在用户接受其为概率性提示时加入。

短歌、朋克、极简民谣等应按风格降低密度。若模型忽略结构，第一步不是继续加词，而是缩短标签、保留标准 section token，并把全局细节移回 Style。

## 复合标签写法

推荐结构（按优先级选 1–3 项，不要求全部填写）：

```text
[Standard section: primary performer, one arrangement or groove change, one dynamic or transition]
```

示例：

```text
[Intro: ethereal piano and flute melody, gentle string pad, subtle flowing-water ambience]
[Vocal: clear and soothing mixed choir (SATB), spacious hall reverb]
[Verse 1: Soprano and Alto lead, clear enunciation over sparse piano arpeggios]
[Pre-Chorus: rhythm intensifies, horn stabs enter, rising vocal layers]
[Chorus: full SATB choir, rich harmonies, flowing melody supported by strings and flute]
[Bridge: arrangement drops to bass and drums, rhythmic and sparse, spoken delivery]
[Final Chorus: full ensemble, maximum emotional depth, anthem-like lift with controlled power]
[Outro: piano and humming choir remain, diminuendo to silence with a final bird call]
```

描述应优先使用可听见、可执行的动作，如 `drops to bass and drums`、`horn stabs enter`，少用空泛评价，如 `very amazing`、`perfect music`。

## 标签层级

### 1. 全曲设置

用于开头声明总体人声、空间或特殊声音场景：

```text
[Vocal: clear and confident male lead, subtle slapback delay]
[Choir: mixed SATB, warm blend, clear diction, spacious reverb]
[Ambience: flowing water and distant birds, subtle and non-intrusive]
```

全局设置只写真正贯穿全曲的条件；局部变化写在对应段落。

### 2. 段落与编排

```text
[Intro: syncopated funk guitar riff, steady reggaeton dembow, punchy synth bass]
[Verse 1: clear enunciation over an energetic Latin-funk groove]
[Chorus: full band, catchy melody, layered harmonies, reggaeton pulse]
[Bridge: music softens to sustained chords, sparse and reflective]
[Breakdown: bass and drums only, dry vocal, tension building]
[Final Chorus: wider harmonies, full dynamic range, strongest emotional delivery]
[Outro: conga rhythm and synth-bass fragment remain, gradual fade]
```

### 3. 演唱角色与声部分配

段落级分配使用独立标签：

```text
[Verse 1: Soprano and Alto lead, Tenor and Bass answer at phrase endings]
```

逐句分配允许行首角色 cue：

```text
[Tenor/Bass] 曾追逐 天涯梦想（梦想）
[Soprano/Alto] 梦想～
[Lead vocal] 读王小波 追求浪漫（浪漫）
[Backing vocals] 浪漫！
```

角色 cue 只用于“谁唱这句”。`[Piano Solo] 月下独酌` 不是合法角色 cue，应将 `[Piano Solo: ...]` 独立成行。

常用角色：

```text
[Male vocal]
[Female vocal]
[Lead vocal]
[Backing vocals]
[Soprano/Alto]
[Tenor/Bass]
[Duet]
[Full choir]
[Spoken word]
[Whispered vocal]
```

### 4. 器乐段落

优先只标注乐器与性格，不要默认写精确小节数：

```text
[Piano Solo: lyrical flowing improvisation, gradual build toward richer harmony]
[Trumpet Solo: fiery Latin-jazz, high-note bursts, rhythmic call-and-response]
[Drum Break: explosive, intricate snare and tom patterns, polyrhythmic build]
```

小节数属于 D 级方向性控制，不保证模型严格计数。只有用户明确需要且接受概率性结果时，才追加 `16-bar` 或 4/8 小节展开，且展开写法也要标为低可靠性提示。

### 5. 动态、和声与过渡

```text
[Build: percussion layers enter gradually, harmony opens wider]
[Breakdown: drums drop out, intimate dry vocal over sustained pad]
[Key Change to C Major: lift into the final chorus]
[Three-Part Harmony: staggered entrances, then unified cadence]
[Canon: each voice enters two beats apart]
[Fade Out: instruments disappear one by one, final piano note remains]
```

## 提示放置策略

- **Style 字段**：流派、总体 BPM/节奏感、核心乐器、全局人声类型、总体制作与空间。这是官方明确鼓励使用详细音乐描述的主要位置。
- **Lyrics 的标准 section tag**：结构骨架。
- **Lyrics 的短复合修饰**：只写当前段相对全曲发生的局部变化。
- **演唱歌词本身**：实际要唱出的重复、回声、ad-lib 应直接写出来；不要只写 `(x2)` 并期待严格重复。
- **严格时间/小节要求**：交给 Studio、Replace Section、Extend 或 DAW 后期，不把一次生成当确定性结果。

## 和声、对位与复调控制

### 术语边界（官方 glossary）

不要把这些词当同义词：

- `Harmony / Harmonization`：主旋律之外的声部同时唱不同音高，通常节奏相近；适合副歌加厚。
- `Counterpoint`：两条或更多相对独立的旋律同时进行；比普通和声更复杂、更容易失控。
- `Polyphonic texture`：多条独立旋律形成的复调织体，是总体质感描述。
- `Call and Response`：一个乐句由另一个乐句回应，通常是最容易控制的多角色形式。
- `Unison`：多个声部唱同一旋律，不是和声；可作为复杂和声失败时的稳定降级。
- `Canon / Round`：同一旋律错时进入，属于对位的一种；Suno 官方 glossary 未给出保证执行的专用控制语法，应视为实验性。

### 可靠性阶梯

从低复杂度向高复杂度逐级尝试，不要一开始要求完整 SATB 对位：

1. **交替独唱**：A 一句、B 一句；每句标角色。最容易保持角色边界。
2. **Call and response**：主唱完整句，回应限制为短词或 3–6 个词。
3. **Unison hook + light harmony**：主歌独唱，副歌只有一个短 hook 共同唱，再加轻和声厚度。
4. **Lead + texture**：主唱完整句，另一声部只做持续音、回声、短 ad-lib。
5. **Micro-counterline**：主唱完整句，副声部只唱极短的独立 counter phrase。
6. **Two/three-part harmony stack**：用于歌词简单的副歌，避免同时加入复杂节奏和长句。
7. **Canon / dense counterpoint / SATB polyphony**：最高风险，只作为偏好提示；应准备局部替换、stem/Studio 或 DAW 后期。

一次只提升一个复杂度维度。例如已经要求三声部和声时，不要同时要求复杂切分、快速歌词、声部轮换和精确两拍错位。

### 推荐放置方式

总体行为写在 Style，局部角色写在 Lyrics：

```text
Style: intimate male/female duet, clear contrasting timbres, alternating verses,
call and response, chorus in unison with light three-part harmony,
sparse counterpoint only in the bridge
```

```text
[Verse 1: alternating duet, clear turn-taking]
[Female] 我把晨光放在窗边
[Male] 我从夜色带回答案

[Chorus: both in unison, light three-part harmony on the final phrase]
[Both] 我们沿着同一束光

[Bridge: female lead, male micro-counterlines, sparse texture]
[Female] 穿过沉默继续向前
[Male] 向前
```

`[Female]`、`[Male]`、`[Both]` 是社区经验性 speaker cue，不是官方声部锁。为降低串线，短段落中逐行重申比只在段首写一次更稳定。

### SATB 合唱

优先把 SATB 当作总体音色和声密度，而不是精确乐谱：

```text
Style: mixed SATB choir, clear diction, warm blended tone, homophonic verses,
richer four-part harmony in the final chorus, restrained counterpoint
```

```text
[Verse 1: soprano and alto lead, tenor and bass sustain soft harmony]
...
[Chorus: full SATB choir, homophonic four-part harmony, clear melody on top]
...
[Bridge: tenor and bass lead, soprano and alto answer with short phrases]
...
[Final Chorus: full SATB choir, wider harmony, one brief counterline, strong cadence]
```

`homophonic four-part harmony` 通常比同时要求四条独立旋律更可控。若主旋律必须清楚，明确 `clear melody on top`、`supporting voices remain secondary`。

### 对位与复调模板

先限定主次，再限定密度：

```text
[Bridge: female lead melody, male sparse counterline, no full-sentence overlap]
```

```text
[Final Chorus: clear lead melody, two supporting harmony parts, brief counterpoint only between phrases]
```

```text
[Canon: same short motif enters successively, sparse texture]
```

最后一个 Canon 模板仍是实验性提示。不要写 `each voice enters exactly two beats apart` 并把它当验收保证。

### 复调实验矩阵

用于比较不同控制策略时，每首歌只设一个主实验变量，并尽量保持风格、速度和段落规模相同：

| 实验目标 | Style 主提示 | Lyrics 局部 cue | 成功观察点 | 失败降级 |
|---|---|---|---|---|
| 男女声交替 | `clear contrasting female/male duet, alternating verses` | `[Female]` / `[Male]` 每行明确轮换 | 声部身份和进入顺序清楚 | 改为整段交替独唱 |
| 短句对位 | `sparse micro-counterpoint, lead remains dominant` | 主句后副声部只唱 1–3 词 | 副线独立但不遮主旋律 | 缩为 echo/ad-lib |
| 错时进入 | `experimental canon, sparse staggered entries` | `[Canon: same short motif enters successively]` | 能听到重复动机而非混乱叠唱 | 改成 call and response |
| 三部和声 | `homophonic three-part harmony, clear melody on top` | 只放在副歌或终副歌 | 主旋律清晰、和声加厚 | 改为 unison + light harmony |
| 交错后融合 | `voices gradually merge from contrapuntal texture into unison` | Bridge 先短交错，Final Chorus 写 `unison resolution` | 复调有发展方向而非全曲拥挤 | 保留终段齐唱作为底稿 |

不要把“能否精准错两拍/两小节”当作验收标准；应记录为概率性实验结果。曲目之间比较时，优先固定 Style 长度、歌词长度和段落结构，只改变一个复调 cue。

### 常见失败与降级

- **角色串线**：缩短段落；每句重写 `[Female]`/`[Male]`；只重做失败段落。
- **两个角色听起来像同一人**：在 Style 用一组简短对比音色，如 `airy female / grounded male`；不要堆十个形容词。
- **和声变齐唱**：接受齐唱作为稳定底稿，或在副歌最后一句单独要求 `light harmony`; 不要整段反复加标签。
- **对位变成含混叠唱**：把副声部缩为持续音、回声、1–3 词 ad-lib 或 micro-counterline。
- **SATB 没有四个清晰声部**：将目标降为 `mixed choir with rich four-part harmony`；严格声部分离需要 stems/外部编曲。
- **标签被唱出**：减少 bracket 噪音，把行为说明移到 Style，只保留标准结构和逐行角色 cue。
- **局部失败**：使用 Replace Section/Song Editor/Studio 修复最小片段，不整首重新生成。

社区资料强调：没有官方 duet toggle；长段落、只在顶部写一次角色、以及两条完整句子同时重叠，都会增加漂移。最稳定的重叠材料是持续音、短回声、短 ad-lib、unison doubles 和 micro-counterlines。

## 推荐的段落发展弧线

不要让重复段落只复制同一标签。常见发展方式：

```text
[Chorus: full band, warm harmonies, controlled energy]
...
[Chorus: fuller band, richer harmonies, added counter-melody]
...
[Final Chorus: maximum ensemble, widest harmonies, emotional peak, decisive ending]
```

也可以反向收束：最终副歌后突然降为无伴奏、耳语或单一乐器。标签应服务歌曲叙事，而不是固定追求“越来越响”。

## 不规范写法

### 技术描述混入圆括号

```text
# 不推荐：英文制作指令可能被当作歌词
相期邈云汉。(all voices, swell)

# 推荐
[All voices: gradual swell into the cadence]
相期邈云汉。
```

### 把制作标签和歌词写在同一行

```text
# 不推荐
[Verse 1: sparse piano arpeggio] 清风拂山岗

# 推荐
[Verse 1: sparse piano arpeggio, intimate lead vocal]
清风拂山岗
```

### 合法的行内角色 cue

```text
[Lead vocal] 清风拂山岗
[Backing vocals] 山岗～
```

### 拼音提示

```text
# 不推荐：可能把拼音唱出
相期邈(miǎo)云汉。

# 推荐
[Pronounce 邈 as miǎo]
相期邈云汉。
```

### 回声歌词不是技术描述

```text
此心安处 是吾乡（吾乡）
[Backing vocals] 吾乡！
```

中文括号中的回声是要唱出的内容，应保留在纯歌词中；不要自动转换为技术标签。若需要更强控制，优先改成显式 backing-vocal 行。

## 避免过度控制

以下情况应删减或合并标签：

- 同一标签同时要求 `whispered` 与 `maximum power`，却没有角色区分。
- 每句歌词前重复完全相同的人声或配器说明。
- Style 已声明全曲固定条件，又在每段逐字重复。
- 一个短段落塞入过多乐器、多个调性变化和互斥动态。
- 标签只堆形容词，没有可执行的音乐动作。

优先让一个标签表达清晰的段落意图；需要逐句角色切换时才使用行内 cue。

## 证据来源与结论

### Suno 官方（一手资料）

- [Can I use my own lyrics?](https://help.suno.com/en/articles/2415873)：Custom mode 可输入自有歌词并提供更多上下文；未定义完整 bracket 语法。
- [Music Glossary for Suno](https://help.suno.com/en/articles/9010177)：官方列出 Tempo/Rhythm、Dynamics、Song Structure、Instrumentation、Vocal Techniques、Production 等可用于 prompt 的词汇，并明确建议组合术语；原文结论为更具体的音乐词汇会带来更多控制。
- [Introducing v4.5](https://suno.com/blog/introducing-v4-5)：官方称新模型更好理解细节、情绪、乐器和技术音乐元素，支持更丰富的描述；没有承诺精确小节计数或任意 metatag 必然执行。

### 社区资料（经验性、非官方契约）

- [HookGenius lyrics formatting guide](https://hookgenius.app/learn/suno-lyrics-formatting/)：汇总常见 section/vocal/production tags，同时明确非标准标签可能被不可预测地解释；结构被忽略时建议退回简单 section tags，重复歌词应直接写出而非依赖 `(x2)`。
- [Duet & Harmony Meta Tags for Suno](https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/duet-harmony-theme-meta-tags-suno)：明确没有官方 duet toggle；建议短段落逐行 speaker label，先交替再短回应/轻和声，完整句重叠容易坍缩，失败后替换最小段落。
- 社区资料只能用于形成候选写法和失败降级策略，不能用来宣称 Suno 官方支持或保证执行。

### 工作流结论

1. 用官方音乐词汇提高描述质量。
2. 用简单标准 section tags 锚定结构。
3. 用短复合标签表达每段最重要的局部变化。
4. 对角色 cue、独奏长度和精确小节数标记为概率性控制。
5. 通过生成结果试听验证；需要严格精度时进入编辑/DAW 工作流。

## 规范化模式

### 严格规范化（strict）

- 英文圆括号技术描述转换为独立中括号标签。
- 拼音提示转换为独立控制提示。
- 制作/段落标签与歌词分离。
- 保留合法的行首演唱角色 cue，不拆散逐句声部分配。

### 最小修正（minimal）

- 只处理明显格式错误和可能被唱出的技术文本。
- 保留合法的行首演唱角色 cue。
- 保留大部分用户原稿格式。
