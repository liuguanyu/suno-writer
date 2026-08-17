# 严格 A cappella 与 Vocal-Only 制作规范

本文件只在用户要求 A cappella、Acapella、vocal-only、纯人声、严格无乐器或人声合唱时读取，同时遵守 `../suno-tags.md`。若要求 A cappella Rap，再额外读取 `rap.md`。

> 证据边界：Suno 官方 Music Glossary 把 `A Cappella` 定义为没有器乐伴奏的歌唱，也列出 `Call and Response`、`Monophonic`、`Homophonic`、`Polyphonic` 等术语。官方没有提供绝对无乐器的硬开关；以下 prompt 组合、验收和降级主要是社区经验。

## 纯人声分层

按严格程度选择，不要把所有层级同时写入：

1. **纯单声部**：`strict a cappella, solo voice, vocals only, no instruments`
2. **纯人声和声**：`unaccompanied human voices, layered vocal harmony, no instrumental accompaniment`
3. **人声打击版本**：在上述基础上加入 `vocal percussion / beatbox only`
4. **人声模仿器乐**：`vocal bass`、`mouth trumpet` 等，最容易被模型转成真实乐器，不适合严格验收。

## Style 示例

```text
strict a cappella, vocals only, unaccompanied human voices,
no instruments, no drums, no bass, no synths, no backing track,
dry intimate vocal recording, clear diction
```

避免在同一 Style 中出现 `piano`、`guitar`、`orchestral`、`808`、`synth bass`、`instrumental accompaniment` 等正向器乐词。`no instruments` 是负向意图而不是硬约束；若仍出现器乐，应缩短 prompt、移除冲突标签并重新生成，而不是无限堆叠更多否定词。

## Lyrics 标签示例

```text
[Intro: unaccompanied voices only]
[Verse 1: solo vocal, dry and intimate, no instruments]
歌词保持短句，留出呼吸。

[Chorus: layered human voices, homophonic harmony, vocals only]
主旋律清楚，和声只在句尾加厚。

[Bridge: call and response, human voices only]
[Lead vocal] 一句主问
[Backing vocals] 一句短答

[Outro: voices only, fade to silence]
最后一句放慢，直至无声。
```

若目标是 beatbox A cappella，明确它是人声：

```text
[Break: vocal percussion and beatbox only, no drum kit]
```

若目标是绝对无节奏伴随，不要写 `beatbox`、`vocal percussion` 或 `vocal bass`。

## 与其他专题组合

- A cappella Rap：同时读取 `rap.md`。
- 无字 A cappella：同时读取 `wordless-vocals.md`，用短元音、哼唱或 vocalise 代替语义歌词。
- Gospel A cappella：同时读取 `gospel.md`，并删除其中 organ、piano、bass、drums、handclaps 等器乐或打击乐正向词；如果拍手也不允许，要明确排除。
- R&B A cappella：同时读取 `r-and-b.md`，保留主唱 phrasing 与和声方向，删除 Rhodes、bass 和 drums。
- 严格纯人声复调：读取 `../suno-tags.md` 的和声/复调阶梯，先从 call-and-response 或 homophonic harmony 开始。

组合示例：

```text
strict a cappella Chinese rap, solo dry spoken vocal, clear diction,
controlled pauses, vocals only, no instruments, no beatbox
```

```text
a cappella hip-hop, rhythmic spoken rap, human vocal percussion only,
solo lead with sparse backing responses, no instrumental accompaniment
```

不要同时要求 `strict vocals only`、完整鼓组、808、乐器独奏和强烈器乐旋律；这是互相冲突的验收条件。

## 验收与降级

A cappella 是官方音乐术语，但仍是生成方向，不是硬开关。试听时分别记录：

- 是否出现真实鼓、贝斯、和弦或环境伴奏；
- 是否只是人声口技；
- 主旋律是否清晰；
- 和声是否变成器乐 pad；
- 结尾是否真正淡到无声。

失败时按以下顺序降级：

1. 删除所有器乐和复杂段落修饰，只保留 `strict a cappella, vocals only, no instruments`。
2. 将多声部改成 `solo vocal`，确认纯人声后再逐步加入 `layered harmony`。
3. 将复杂复调改成 `unison` 或短 `call and response`。
4. 仍需绝对干净的 vocal stem 时，使用外部人声分离/DAW 检查与修整；不要把一次 Suno 生成当作隔离 stem 保证。

## 资料与可信度

### 官方

- [Music Glossary for Suno](https://help.suno.com/en/articles/9010177)：定义 A Cappella、Call and Response、Harmony/Harmonization、Monophonic/Homophonic/Polyphonic。
- [Can I use my own lyrics?](https://help.suno.com/en/articles/2415873)：Custom mode 可输入自有歌词和上下文；未定义完整 bracket 标签契约。

### 社区线索（非官方契约）

- [SunoAI Reddit：vocals only / isolated vocals 讨论](https://www.reddit.com/r/SunoAI/search/?q=vocals%20only&restrict_sr=1)：可观察 `vocals only`、`isolated voice` 等写法，但结果不一致。

记录实验时标注模型版本、Style、歌词长度和实际出现的非人声元素；社区 prompt 只能作为候选，不应写成官方支持语法。
