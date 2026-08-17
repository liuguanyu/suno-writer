# 小众、民族与特殊乐器指南

在用户要求民族乐器、古乐器、世界音乐乐器、稀有音色或特殊配器时读取，同时遵守 `../suno-tags.md`。

## 核心策略

Suno 对常见英文乐器名通常比冷僻中文名更容易理解。Style 中优先使用通行英文名，必要时追加乐器族与演奏动作：

```text
Chinese ambient folk, xiao bamboo flute lead, guqin plucked harmonics,
soft frame drum, sparse cinematic texture, intimate vocal
```

结构建议：`乐器英文名 + 声部职责 + 演奏法/音色 + 所处段落`。

示例：

- `guqin, sparse plucked harmonics, intro motif`
- `xiao bamboo flute, breathy sustained counter-melody`
- `morin khuur, bowed drone and lyrical response`
- `nyckelharpa, resonant bowed ostinato`
- `hang drum / handpan, soft pulsing pattern`
- `duduk, mournful breathy solo`
- `shakuhachi, airy phrases with silence between notes`
- `kalimba, delicate repeating ostinato`

不要声称模型一定能区分音色相近的小众乐器。

## 配器模板

```text
[Intro: solo duduk, breathy sustained phrases, no percussion]
[Verse 1: lead vocal over sparse guqin harmonics]
[Interlude: xiao flute answers the vocal motif]
[Bridge: morin khuur drone enters, texture gradually thickens]
[Outro: solo instrument returns, natural decay]
```

每段优先突出一个特殊乐器。若同时列出五六种，模型可能改成泛化的“世界音乐/管弦乐”质感。

## 名称核验

- 不确定英文名时先查可靠乐器资料，不要直译创造名称。
- 同名异物时补充地区或乐器族，如 `Chinese xiao bamboo flute`。
- 用户要求具体演奏法时使用可听见动作：`bowed drone`、`plucked harmonics`、`breathy sustain`、`tremolo picking`。

## 常见失败与降级

- **没有目标乐器**：删除次要乐器，让目标乐器成为 `solo lead` 或开场唯一音色。
- **被替换成相近常见乐器**：加入地区、材质和演奏法，但不要堆同义名。
- **配器拥挤**：每个段落只保留一个主乐器和一个支持层。
- **必须获得真实特定音色**：使用用户提供的 audio reference、Studio/DAW 或真实采样；文本生成不能作为严格乐器识别保证。
