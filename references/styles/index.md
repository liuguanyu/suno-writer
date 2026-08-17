# Suno 风格与制作专项索引

仅在创作需求命中具体流派、唱法或配器专题时读取本索引；随后只加载相关专题文件。所有专题都必须同时遵守上级 `../suno-tags.md` 的通用标签格式、可靠性分级和概率性控制边界。

| 用户意图或关键词 | 加载文件 |
|---|---|
| Rap、Hip-Hop、flow、cadence、说唱 | `rap.md` |
| 严格无乐器、vocal-only、纯人声、A cappella / Acapella | `acapella.md` |
| 无字歌、无词歌、哼唱、吟唱、vocalise、wordless vocal、无语义人声 | `wordless-vocals.md` |
| R&B、Soul、Neo-Soul、丝滑律动、旋律型主唱 | `r-and-b.md` |
| Jazz、爵士、Swing、Bebop、Cool Jazz、Smooth Jazz、Jazz Fusion、Vocal Jazz、Scat | `jazz.md` |
| Funk、放克、P-Funk、Funk Rock、Electro Funk、Boogie、Groove | `funk.md` |
| Blues、布鲁斯、蓝调、Delta Blues、Chicago Blues、Electric Blues、Blues Rock、Shuffle | `blues.md` |
| Reggae、雷鬼、Roots Reggae、Dub、Dancehall、Ska、Rocksteady | `reggae.md` |
| Reggaeton、雷鬼顿、Dembow、Perreo、Latin Urban、Trapeton、拉丁都市律动 | `reggaeton.md` |
| Folk、民谣、Singer-Songwriter、Folk Rock、Americana、Contemporary Folk | `folk.md` |
| Country、乡村、Country Pop、Outlaw Country、Bluegrass、Alt-Country | `country.md` |
| 转音、melisma、vocal run、真假声、belt、演唱技巧 | `vocal-techniques.md` |
| 民族/世界乐器、古乐器、小众乐器、特殊配器 | `uncommon-instruments.md` |
| Electronic、EDM、House、Techno、Drum and Bass、Glitch、Future Bass | `electronic.md` |
| Synthwave、Retrowave、Outrun、80s 电影配乐、霓虹复古未来 | `synthwave.md` |
| Synthpop、合成器流行、New Wave、明亮复古电子流行 | `synthpop.md` |
| City Pop、城市流行、日本 80s 流行、都市夜景 | `city-pop.md` |
| Vaporwave、蒸汽波、Mallsoft、商场氛围、梦核、虚无怀旧 | `vaporwave.md` |
| Lo-Fi、Lofi、Lo-Fi Hip Hop、Chillhop、Lo-Fi Beats、Bedroom Pop、放松学习/助眠 | `lo-fi.md` |
| 氛围摇滚、Ambient Rock、Shoegaze、Dream Rock、空间吉他 | `ambient-rock.md` |
| 摇滚、Rock、经典摇滚、硬摇滚、Arena Rock、另类摇滚、独立摇滚、Garage Rock | `rock.md` |
| Indie、独立摇滚、独立流行、Indie Rock、Indie Pop、Indie Folk、Dream Pop、Jangle Pop | `indie.md` |
| 朋克、Punk、Punk Rock、Pop Punk、Hardcore、Skate Punk、Post-Hardcore | `punk.md` |
| 后朋、Post-Punk、哥特摇滚、Darkwave、Coldwave、阴郁另类摇滚 | `post-punk.md` |
| 后摇、Post-Rock、器乐摇滚、渐进式摇滚、动态爆发、Cinematic Rock | `post-rock.md` |
| 金属、Metal、重金属、Thrash、Death、Black、Progressive Metal、Metalcore | `metal.md` |
| 巴洛克流行、Baroque Pop、Chamber Pop、室内流行、Orchestral Pop | `baroque-pop.md` |
| Gospel、福音合唱、教堂和声、赞美诗、呼应式合唱 | `gospel.md` |

组合请求只读取必要文件。例如“福音 R&B，副歌大量转音”读取 `r-and-b.md`、`gospel.md`、`vocal-techniques.md`；“A cappella Rap”读取 `rap.md` 与 `acapella.md`；“无字 A cappella 合唱”读取 `wordless-vocals.md` 与 `acapella.md`；“City Pop × Vaporwave”读取 `city-pop.md` 与 `vaporwave.md`；“后摇式动态爆发的 Shoegaze”读取 `post-rock.md` 与 `ambient-rock.md`；“巴洛克流行 × 电子”读取 `baroque-pop.md` 与 `synthpop.md`。不要加载整个目录。

## 跨专题组合原则

1. 先确定一个主流派文件，再按需要增加一个人声或配器专题。
2. Style 中优先保留流派、速度/律动、核心音色、人声和制作空间；不要拼接每份文件的所有示例。
3. 同一首最多设置 1–2 个实验变量。复杂唱法、密集复调、精确速度变化和大量特殊乐器不要同时作为硬目标。
4. 专题提示都是生成方向。需要精确音高、和弦、节拍、声部分离或绝对配器时，进入 Studio/DAW 工作流。
