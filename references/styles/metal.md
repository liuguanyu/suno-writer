# 金属制作指南

在用户要求 Metal、金属、重金属、Thrash、Death、Black、Progressive Metal 或 Metalcore 时读取，同时遵守 `../suno-tags.md`。硬摇滚读取 `rock.md`，朋克读取 `punk.md`。

> 证据边界：Metal 子流派的 prompt 组合是社区经验，Suno 官方 glossary 未定义专属语法。

## 先锁定子流派

不要只写 `metal`。优先明确：子流派、吉他音色、鼓速、唱腔与整体能量。

```text
heavy metal, distorted power chords, double-kick drums,
powerful operatic vocal, massive wall of sound, intense energy
```

可替换方向：

- 经典重金属：`classic heavy metal, galloping riffs, soaring vocals, twin guitar harmonies`
- Thrash：`thrash metal, aggressive fast riffing, tight double-kick, shouted vocals`
- Death：`death metal, low-tuned guitars, blast beats, guttural growled vocals`
- Black：`black metal, tremolo-picked riffs, blast beats, icy atmospheric production`
- Progressive Metal：`progressive metal, odd time signatures, technical riffs, clean and harsh vocals`
- Metalcore：`metalcore, breakdowns, chugging riffs, screamed verses with sung chorus`

## 段落模板

```text
[Intro: heavy riff and double-kick, building intensity]
[Verse 1: aggressive riff, rhythmic vocal, tight drums]
[Chorus: anthemic heavy hook, powerful vocal, full wall of sound]
[Breakdown: slowed chugging riff, massive low end]
[Guitar Solo: technical or melodic, over driving rhythm]
[Final Chorus: fastest, heaviest, decisive ending]
```

极端唱腔（growl、scream、blast beat）是方向提示，不保证精确音色与速度。

## 人声与歌词

- 清晰度与极端唱腔常是权衡：要主唱可辨时写 `clear powerful vocal`。
- 极嗓：`guttural growled vocal`、`harsh screamed vocal` 是概率性 cue。
- 无字时读取 `wordless-vocals.md`，但金属通常以器乐和旋律钩子为主。

## 常见失败与降级

- **太重变成噪声**：减少同时堆叠 `blast beats`、`growl`、`low-tuned`，保留一个主变量。
- **失去金属感**：加强 `distorted riffs`、`double-kick`、`wall of sound`。
- **主唱被淹没**：写 `clear lead vocal above the heavy arrangement`。
- **子流派混乱**：锁定一个主金属子流派，删除冲突鼓型。

## 资料与可信度

- Suno 官方 glossary 将 Metal 列为重失真吉他、强力人声的音乐词汇。
- 社区教程与 AI 概览：`heavy distorted riffs, double-kick bass, massive wall of sound` 是经验性写法。
