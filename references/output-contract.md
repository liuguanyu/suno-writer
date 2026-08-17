# 创作输出契约

> 参考：§6 创作输出契约、§8 Style 规范、§9 Suno 页面约束

## Markdown 输出格式

### 中文歌词

至少返回以下四个部分（§6.1 固定顺序）：

```markdown
## 歌词

[Verse 1]

演唱歌词……

## Style

English style prompt

## 歌名

歌曲名称

## 不含技术词的歌词

演唱歌词……
```

### 非中文歌词

在上述四部分之后额外增加中文翻译：

```markdown
## 中文翻译

中文自然翻译……
```

## 专辑 Markdown 输出格式

专辑由一级标题、可选简介和至少两首曲目组成。每首曲目沿用单曲四部分契约，但使用三级标题：

```markdown
# 专辑名称

可选的专辑简介。

## 曲目 1：第一首歌

### 歌词

[Verse 1]
演唱歌词……

### Style

English style prompt

### 歌名

第一首歌

### 不含技术词的歌词

演唱歌词……

## 曲目 2：第二首歌

……
```

曲目编号必须从 1 连续递增，歌名不能重复。专辑提交要求用户精确确认曲目数；每首曲目分别消耗一次生成所需 credits。

## Suno 字段映射

| Markdown 部分 | Suno Advanced 字段 | 页面限制 |
|---|---|---|
| `歌词` | `Lyrics editor` | 5000 字符 |
| `Style` | `Styles` | 1000 字符 |
| `歌名` | `Song Title` | 可选（≤ 200 字符） |

以下内容不得提交到 Suno：
- `不含技术词的歌词`
- `中文翻译`
- 工作流说明或校验报告

## Style 规范

Style 使用英文，建议包含：

- Genre / subgenre
- Mood
- BPM / tempo
- Key / modulation
- Time signature
- Instrumentation
- Vocal arrangement
- Performance style
- Dynamics
- Production / mixing / space

示例：

```text
Chamber Pop, Chill Pop, 68 BPM, A minor modulating to C Major,
xiao bamboo flute with cold breathy tones, grand piano arpeggios,
string quartet, male lead, female harmonies, child choir in final chorus,
solitary, ethereal, intimate, hall reverb, wide stereo
```

## 提交按钮

一次生成默认生成两个作品版本，点击 `Create song` 消耗 Suno credits。
