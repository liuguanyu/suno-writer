---
name: suno-song-writer
description: Suno 单曲与专辑创作、校验、提交、状态跟踪、WAV 下载及中断恢复工作流。CLI 负责确定性操作；Agent 负责浏览器交互；当用户要求写歌、规划或创作专辑、提交到 Suno、排查 Suno 浏览器/代理/登录环境、下载 WAV、恢复或核对未完成生成任务时使用。
---

# Suno Song Writer

编排模型创作与项目 TypeScript CLI：模型负责概念、歌词和风格等语义创作；CLI 负责校验、环境预检、状态持久化、轮询和下载；Agent 负责 Suno 浏览器交互（登录、填表、点击 Create、捕获生成响应）。

## 渐进读取路由

只读取当前任务所需文档；进入提交前必须额外读取预检与提交文档，遇到中断或状态不明时必须读取恢复文档。

| 用户意图 | 必读文档 |
|---|---|
| 创作、修改或校验一首歌 | `references/song-creation.md` |
| 规划、创作、修改或校验专辑 | `references/album-creation.md` |
| 检查代理、登录、Cloudflare 或提交条件 | `references/doctor-workflow.md` |
| 提交单曲或专辑（浏览器交互）、轮询并下载 WAV | `references/submission-workflow.md` + `references/doctor-workflow.md` + `references/browser-adapter.md` |
| 恢复批次、处理中断或 Create 后状态不明 | `references/recovery-workflow.md` |
| 编写/检查歌词控制标签 | `references/suno-tags.md` |
| 指定流派、唱法或特殊配器（如摇滚、朋克、后朋、后摇、金属、巴洛克流行、R&B、转音、无字歌、小众乐器、电子、氛围摇滚、福音、Rap、A cappella 等热门流派） | `references/styles/index.md`，再只读取命中的专题文件；同时遵守 `references/suno-tags.md` |
| 确认 Markdown 字段及页面长度映射 | `references/output-contract.md` |
| 维护浏览器适配或调查页面变化 | `references/browser-adapter.md` + `references/suno-integration.md` |
| 维护 Suno 接口适配或调查接口变化 | `references/suno-integration.md` |

单次任务可以组合读取，例如"创作并提交专辑"依次读取专辑、预检、提交文档；不要提前加载与当前阶段无关的接口细节。

## 不可绕过的额度与安全规则

以下规则始终生效，不得下放、弱化或被 reference 覆盖：

1. 默认只创作和展示草稿。没有用户对本次操作的明确确认，绝不点击 `Create song`，也不执行任何消耗 Suno credits 的操作。
2. 单曲确认只授权一个生成批次；专辑必须按顺序逐曲提交。
3. 每次提交前都必须运行 `pnpm doctor`。只有报告明确给出 `safeToSubmit=true` 才能继续。
4. `doctor.selectedProxy` 是本次提交的唯一代理事实源。Agent 打开浏览器时必须复用该代理配置。值为空表示经 doctor 验证可直连，不得自行补代理。
5. 任一曲目失败，或点击 Create 后无法确认响应/结果，立即停止剩余提交。`unknown_submission_state` 绝不自动重试，必须先核对已有结果并再次获得用户授权。
6. Cloudflare"验证您是真人"只能由用户手动完成。不得绕过、代点或通过规避检测的方式自动化验证。
7. 不持久化认证令牌、Cookie、个人信息、动态 session/browser token 或设备标识；不得写入日志、Markdown 或 manifest。
8. 恢复任务只读取 manifest 中已有的 batch ID、clip ID 和状态；不得重新推导、猜测或用标题替代稳定 ID。
9. Agent 只通过 `browser_*` 工具操作 Suno 页面；私有接口访问只允许由项目现有 CLI 适配器执行，不临时拼装脚本直接调用 Suno 私有接口。

## 确定性命令入口

在包含本 Skill 实现的 `suno-writer` 项目根目录执行。命令输出应使用稳定 JSON 信封；根据 `ok`、稳定错误码和结构化字段判断结果，不通过自由文本猜测成功。

```bash
# 环境预检，不消耗 credits
pnpm doctor [--proxy=<proxy-url>]

# 校验
pnpm validate <song.md> [--mode=strict|minimal]
pnpm validate:album <album.md> [--mode=strict|minimal]

# 专辑设计
pnpm design-album <concept.json> [--output=<album-template.md>]

# 恢复已有批次；仅在项目已提供安全会话通道时使用
pnpm resume <batch-dir>
```

### Agent 浏览器提交流程

`submit` 和 `submit:album` 不再由 CLI 执行。Agent 负责以下浏览器交互：

1. 运行 `pnpm doctor` 获取 `selectedProxy`，用该代理打开浏览器。
2. 导航到 `https://suno.com/create`，如未登录则等待用户手动完成。
3. 切换到 Advanced 模式，填写 Lyrics、Style、Song Title。
4. 用户确认后点击 Create。
5. 捕获或从稳定页面链接核对真实 `batch_id`、`clip_ids`；不得猜测 ID，也不得读取或持久化认证头、Cookie、browser token 或 device ID。
6. 创建 `outputs/<timestamp>-<slug>/` 批次目录，写入 `song.md` 和 `manifest.json`；状态无法确定时写入 `unknown_submission_state` 并停止。
7. 只有在项目提供不暴露认证信息的受支持恢复通道时，才运行 `pnpm resume <batch-dir>` 轮询状态并下载 WAV；否则明确报告当前无法独立恢复。

若 `doctor.selectedProxy` 为空，Agent 以直连方式打开浏览器；若非空，Agent 配置浏览器使用该代理。CLI 尚未提供的能力不得伪装成已有命令。
