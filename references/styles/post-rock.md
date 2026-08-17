# 后摇制作指南

在用户要求 Post-Rock、后摇、器乐摇滚、渐进式摇滚、动态爆发或 Cinematic Rock 时读取，同时遵守 `../suno-tags.md`。氛围摇滚与 Shoegaze 读取 `ambient-rock.md`。

> 证据边界：Post-Rock 的 prompt 组合是社区经验，Suno 官方 glossary 未定义专属语法。精确小节数与渐强时长是低可靠性提示。

## 核心特征

后摇以重复动机、由静到强的长动态弧线、器乐深度和电影感张力为核心，人声常作远景层或干脆器乐化。

## Style 模板

```text
post-rock, repeating guitar motif, slow dynamic build,
cinematic crescendo, wide instrumental textures,
restrained drums growing into cathartic climax
```

可替换方向：

- 更氛围：`ambient post-rock, evolving soundscapes, sparse percussion, slow harmonic motion`
- 更电影感：`cinematic post-rock, orchestral layers, dramatic builds, epic climax`
- 更器乐：`instrumental post-rock, guitar-driven melody, no lead vocal`
- 更 Math Rock 影响：`math-rock influenced post-rock, odd time signatures, interlocking guitar lines`

## 段落模板

```text
[Intro: clean delay-guitar motif, distant ambient swell]
[Verse 1: restrained drums, intimate texture, open space]
[Build: repeating motif, drums gradually intensify]
[Climax: full distorted guitar wall, cymbal wash, emotional peak]
[Resolution: texture thins, motif returns quietly]
[Outro: feedback and delay tails decay into silence]
```

精确“8/16 小节渐强”仍是低可靠性提示，用可听见的层次进入描述动态弧线。

## 人声与歌词

- 常为器乐或远景人声：写 `wordless vocal layer`、`distant choir pad`。
- 要完整主唱时，明确 `clear lead vocal above the guitar texture`。
- 无字时读取 `wordless-vocals.md`。

## 常见失败与降级

- **变成普通流行摇滚**：加强 `repeating instrumental motif`、`slow build`、`instrumental climax`，减少 `catchy pop chorus`。
- **一开始就过满**：明确 Intro/Verse 的 `clean sparse guitars, restrained drums`。
- **人声不可辨**：改为 `clear lead vocal above the guitar texture`。
- **动态弧线不清晰**：写 `gradual build`、`cathartic climax`，不要只堆乐器。

## 资料与可信度

- 社区教程与 AI 概览：`ambient soundscapes, gradual builds, dynamic explosions, instrumental depth, cinematic tension` 是经验性写法。
