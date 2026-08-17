# 和弦指定与和声进行指南

在用户要求指定或描述和弦、和声进行、和弦性质（大三、小三、大七、小七、小九、属七、减七、挂留、转位、级数进行等）时读取，同时遵守 `suno-tags.md`。

> 证据边界：Suno 是生成模型，不是 DAW。精确和弦拼写、声部排列（voicing）、转位与逐拍进行都是方向性提示，不能保证逐音执行；需要精确和声时进入 Suno Studio 或 DAW 后期。

## 核心边界

和弦控制分两个层次，按可靠性从高到低：

1. **调性/和声色彩**（相对可靠）：major/minor 的明暗、七/九和弦的爵士感、挂留的空灵感。Suno 官方 glossary 认可这些音乐词汇，放入 Style 遵循率较高。
2. **精确和弦拼写与进行**（低可靠）：具体和弦名、转位、级数进行的逐拍执行只能作方向。

实际写入 prompt 时，和弦术语一律用英文；中文只是用户与 Agent 之间的沟通语言。

## 和弦词汇对照表

### 三和弦（triads）

| 中文 | 英文 | 色彩提示 |
|---|---|---|
| 大三和弦 | major triad | 明亮、稳定、上扬 |
| 小三和弦 | minor triad | 忧郁、内敛 |
| 减三和弦 | diminished triad | 紧张、不协和、悬而未决 |
| 增三和弦 | augmented triad | 奇幻、漂移、不稳定 |

### 七和弦（seventh chords）

| 中文 | 英文 | 色彩提示 |
|---|---|---|
| 大七 | major seventh（maj7） | 柔美、梦幻、爵士 |
| 属七 | dominant seventh（7） | 张力、需要解决 |
| 小七 | minor seventh（m7） | 忧郁而圆润 |
| 半减七 | half-diminished seventh（m7♭5） | 暧昧、张力 |
| 减七 | diminished seventh（dim7） | 强烈紧张、悬疑 |
| 小大七 | minor-major seventh（mMaj7） | 神秘、冷峻 |

### 九和弦与扩展（ninths and extensions）

| 中文 | 英文 | 色彩提示 |
|---|---|---|
| 大九 | major ninth（maj9） | 明亮开阔、爵士 |
| 小九 | minor ninth（m9） | 深情、柔和爵士 |
| 属九 | dominant ninth（9） | 蓝调/放克张力 |
| 加九 | added ninth（add9） | 清澈、流行感 |
| 六和弦 | sixth（6） | 温暖、复古 |
| 小六 | minor sixth（m6） | 复古忧郁 |
| 十一 | eleventh（11） | 悬浮、开阔 |
| 十三 | thirteenth（13） | 浓厚爵士色彩 |

### 挂留与转位（suspensions and inversions）

| 中文 | 英文 | 色彩提示 |
|---|---|---|
| 挂二 | sus2 | 空灵、未解决 |
| 挂四 | sus4 | 悬留、期待解决 |
| 第一转位 | first inversion | 低声部为三音 |
| 第二转位 | second inversion | 低声部为五音 |
| 斜杠和弦 | slash chord（如 C/E） | 低声部改变、连接更平滑 |

## Style 字段写法

优先写和声色彩而非具体和弦名，遵循率更高：

```text
warm major tonality, uplifting and bright
wistful minor tonality, melancholic and intimate
jazzy seventh chords, extended jazz harmony
ethereal suspended chords, airy and unresolved
```

## Lyrics 段落写法

段落级和声方向属于概率性控制（B/C 级），每段只写 1–2 个变化：

```text
[Verse 1: minor tonality, sparse, melancholic]
[Pre-Chorus: suspended chord, tension unresolved]
[Chorus: shifts to relative major, uplifting lift]
[Bridge: diminished chord, brief tension before resolution]
```

## 级数与和声进行（D 级方向）

可写级数进行作为整体方向，不保证逐拍精确：

```text
I–V–vi–IV：流行明亮
ii–V–I：爵士终止
I–vi–IV–V：复古/50s 循环
i–VI–III–VII：小调循环
```

精确和弦名（如 `C – Am – F – G7`）与转位只作为方向性提示；要保证具体和弦、声部排列或转调时刻，进入 Suno Studio / DAW 后期，不依赖一次生成。

## 常见失败与降级

- **明确和弦名被忽略/唱错**：降为调性/明暗描述（`major tonality`、`minor tonality`），把精确和弦交给 Studio。
- **七/九和弦变成普通三和弦**：在 Style 强化 `jazzy extended chords`、`seventh chords`，减少密集节奏要求。
- **挂留失去悬留感**：写 `suspended chord, unresolved tension`，并在 Bridge 或 Pre-Chorus 单独标注一次。
- **转调/级数进行没执行**：删掉精确进行，改为 `modulate to relative major in the final chorus` 这类方向描述。
- **和弦色彩与情绪冲突**：先定调性（major/minor），再叠单个和弦色彩，避免同时要求 `bright major` 与 `diminished tension` 硬冲突。

## 资料与可信度

- Suno 官方 glossary 认可 Major/Minor 等调性词汇与音乐方向描述，但没有发布精确和弦拼写、转位或级数进行的控制语法；具体和弦名只能作方向性提示。（官方源无法从当前网络环境访问，此项待按 `help.suno.com` 官方 glossary 最终核实。）
- 社区实测（HookGenius）：Suno 确认可用的 bracket 标签里没有具体和弦名标签（如 `[C Major]`、`[Am7]`），只有 `[Harmony]` 一个和声相关标签，且属方向提示而非硬命令。
- 社区实测（Jack Righteous）：`[Harmony]` 等标签应视为 steering cue，不是硬命令；总体和声关系放 Style 字段，精确控制交给 Replace Section / Studio 编辑层。
- 因此 `jazzy seventh chords`、`suspended chords`、`major tonality`、`minor tonality` 等色彩词放入 Style，遵循率高于写具体和弦名；具体和弦拼写与级数进行只在用户接受概率性结果时作为方向使用。
