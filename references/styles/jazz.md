# 爵士制作指南

在用户要求 Jazz、爵士、Swing、Bebop、Cool Jazz、Smooth Jazz、Jazz Fusion、Vocal Jazz、Scat 或即兴摇摆时读取，同时遵守 `../suno-tags.md`。R&B/Neo-Soul 读取 `r-and-b.md`，Funk 读取 `funk.md`，Blues 读取 `blues.md`。

> 证据边界：Suno 官方 glossary 把 Jazz 列为音乐词汇（即兴、摇摆律动），但子流派细节与 prompt 组合是社区经验，非官方契约。精确速度、和声进行和小节即兴长度是方向提示。

## 先锁定子流派

不要只写 `jazz`。优先明确：子流派、律动、主奏乐器、人声与即兴程度。

```text
smooth jazz, warm saxophone lead, electric piano,
walking bass, brushed drums, laid-back swing, relaxed instrumental
```

可替换方向：

- Swing / Big Band：`swing jazz, big band horns, walking bass, 4/4 swing feel, brass section`
- Bebop / Hard Bop：`bebop, fast tempo, intricate chromatic lines, sax and trumpet unison, driving ride cymbal`
- Cool Jazz：`cool jazz, restrained phrasing, mellow trumpet, sparse piano comping`
- Smooth Jazz：`smooth jazz, polished production, melodic sax, gentle groove`
- Jazz Fusion：`jazz fusion, electric guitar, synth textures, complex rhythms, improvisation`
- Vocal Jazz / Scat：`vocal jazz, scat singing, walking bass, piano comping, brush drums`

## 段落模板

```text
[Intro: piano comping and brushed drums establish swing feel]
[Head: sax and trumpet state the melody, walking bass underneath]
[Verse: relaxed vocal or instrumental statement, sparse comping]
[Improvised Solo: melodic sax or piano solo over rhythm section]
[Chorus: melody returns, fuller horn harmony]
[Outro: head restated, ending on a gentle cadence]
```

精确“即兴 16 小节”是低可靠性提示，用 `melodic solo`、`improvisation`、`trading` 描述方向即可。

## 人声与歌词

- 器乐爵士常用 `instrumental`，主奏乐器写 `saxophone lead`、`piano`、`trumpet`。
- 声乐爵士要清晰主唱时写 `clear jazz vocal`，要即兴唱法写 `scat singing`（概率性 cue）。
- 无字爵士读取 `wordless-vocals.md`，用哼唱或 scat 承担旋律。

## 常见失败与降级

- **变成流行爵士/沙发音乐**：加强 `swing feel`、`walking bass`、`improvisation`，减少 `smooth polished pop`。
- **失去摇摆律动**：写 `swing rhythm`、`brush drums`、`walking bass`。
- **即兴感不足**：写 `improvised solo`、`call-and-response`，不要只重复主旋律。
- **太像 Funk**：弱化 `syncopated bass`、`tight groove`，回到摇摆与即兴。

## 资料与可信度

- Suno 官方 glossary 将 Jazz 列为即兴与摇摆律动的音乐词汇。
- 社区教程与 AI 概览：`walking bass`、`swing feel`、`brushed drums` 等是经验性写法。
