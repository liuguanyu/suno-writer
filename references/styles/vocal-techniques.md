# 转音与演唱技巧指南

在用户要求转音、melisma、vocal run、真假声、belt、气声、耳语、吼腔或其他明确演唱技巧时读取，同时遵守 `../suno-tags.md`。

## 术语与边界

- `Melisma`：一个音节唱多个音高。
- `Vocal run`：快速连续音符，常带即兴感。
- `Falsetto`：较高、轻盈的假声区域。
- `Belt`：胸声主导、强有力的高音表达。
- `Vibrato`：持续音上的轻微音高摆动。
- `Crooning`：柔和、亲密的演唱。
- `Spoken / whispered vocal`：口语或耳语质感，角色和段落仍可能漂移。

这些都是官方 glossary 中可用于 prompt 的音乐词汇，但不是精确音高或发声技术锁定。

## 放置原则

全曲固定音色放 Style，局部技巧放对应段落：

```text
Style: soulful female lead, clear diction, warm chest voice,
restrained melisma, airy falsetto contrast, intimate close-mic production
```

```text
[Verse 1: intimate crooning, minimal ornamentation]
[Pre-Chorus: rising register, light falsetto]
[Chorus: strong clear lead, one brief melismatic ending]
[Bridge: exposed vocal run, sparse accompaniment]
[Final Chorus: controlled belt, short ad-libs between phrases]
```

不要在每行写 `vocal run`。要唱出的 `oh`、`yeah`、拖音或回应应直接写入歌词。

## 实验顺序

1. 先固定主唱音色和清晰度。
2. 只在一个段落加入 `brief vocal run` 或 `restrained melisma`。
3. 再尝试假声/胸声对比。
4. 最后才实验 belt、复杂 ad-lib 和多声部和声叠加。

## 常见冲突

- `breathy whisper` 与 `powerful belt` 不能在同一角色同一句同时成立；应分段或分角色。
- `rapid melisma` + 快速中文长句容易吞字。
- 转音、Canon、密集和声同时出现会降低主旋律清晰度。
- `heavy auto-tune` 是制作效果，不等于转音技巧，且可能削弱自然音色。

## 降级策略

- 转音不明显：只在句尾使用更短歌词，并写 `brief melismatic ending`。
- 转音泛滥：改成 `minimal ornamentation, clear diction`。
- 高音失真：降低为 `controlled strong upper register`，不要强求 belt。
- 角色串线：删去逐句复杂技巧，只保留段落级主唱方向。
