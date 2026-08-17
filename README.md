# Suno Writer

Suno 单曲与专辑撰写工作流 Skill — 从创作到 WAV 下载的全流程自动化。

## 技术栈

- Node.js 22 LTS
- TypeScript
- pnpm
- Zod
- Vitest

## 安装

```bash
pnpm install
```

## 使用

### 提交前环境预检（不消耗 credits）

```bash
pnpm doctor [--proxy=<proxy-url>]
```

`doctor` 按 `--proxy` → `SUNO_PROXY` → macOS 系统代理的优先级选择网络配置，并检测代理连通性及 Suno Web/API 可访问性。成功报告中的 `selectedProxy` 是后续提交的单一代理事实源；若返回 `DOCTOR_CHECK_FAILED`，修复网络或代理后重新运行。

### 校验歌曲 Markdown

```bash
pnpm validate <markdown-file> [--mode=strict|minimal]
```

### 提交歌曲到 Suno

提交通过 Agent 浏览器交互完成，详见 `references/submission-workflow.md`。提交流程：

1. 运行 `pnpm doctor` 和 `pnpm validate` 确认闸门通过
2. Agent 打开浏览器，填写 Suno Advanced 表单
3. 用户确认后点击 Create，Agent 捕获生成响应
4. Agent 创建批次目录和 manifest
5. 运行 `pnpm resume <batch-dir>` 轮询并下载 WAV

### 专辑创作（概念 → 规划 → 生成 → 审阅 → 提交）

**完整五阶段工作流**：

1. **概念收集** — 描述专辑的曲风、乐器、曲数、主题、歌词要求等
2. **曲目规划** — 自动为每首歌规划主题方向和创作要点
3. **逐曲生成** — AI 生成全部歌词、Style、歌名
4. **审阅修改** — 审阅全部曲目，可按需局部修改
5. **逐曲提交** — 确认后按顺序逐曲提交到 Suno

#### 从概念 JSON 设计专辑规划

```bash
pnpm design-album <concept.json> [--output=<template.md>]
```

概念 JSON 格式参考 `examples/四季行歌-概念.json`。

#### 校验专辑 Markdown

```bash
pnpm validate:album <album-markdown-file> [--mode=strict|minimal]
```

专辑使用 `# 专辑名`，每首曲目使用 `## 曲目 N：标题`，曲目内使用 `### 歌词`、`### Style`、`### 歌名`、`### 不含技术词的歌词`。参考 `examples/月下诗集-专辑.md`。

#### 逐曲提交

专辑提交同样通过 Agent 浏览器交互完成。提交前必须先运行 `pnpm doctor`，按顺序逐曲提交，每首歌对应一次 Create、默认产生两个版本。任何曲目提交失败或状态不明时都会停止后续提交，避免继续消耗 credits。

### 恢复未完成的曲目批次

```bash
pnpm resume <batch-dir>
```

## 架构

采用端口与适配器架构，依赖方向单向：

```text
domain / lyrics / ports
          ↑
application use cases
          ↑
adapters: suno-http / filesystem
          ↑
CLI composition root
       +
Agent browser interaction
```

### 模块职责

| 模块 | 唯一职责 |
|---|---|
| `lyrics/validate-markdown` | Markdown 四部分解析与长度校验 |
| `lyrics/validate-tags` | 技术标签格式校验 |
| `lyrics/normalize-tags` | 标签规范化（严格/最小） |
| `lyrics/strip-technical-lines` | 纯歌词提取 |
| `adapters/suno-http/transient-auth` | 进程内认证上下文 |
| `adapters/suno-http/generation-status-client` | feed/v3 状态查询 |
| `adapters/suno-http/wav-conversion-client` | convert_wav + wav_file 轮询 |
| `adapters/filesystem/batch-directory` | 批次目录创建 |
| `adapters/filesystem/stream-downloader` | CDN 流式下载 |
| `adapters/filesystem/wav-validator` | RIFF/WAVE 格式校验 |
| `adapters/filesystem/json-manifest-store` | manifest 读写 |
| `adapters/diagnostics/node-doctor-probe` | 环境预检（代理 + 网络） |
| `lyrics/validate-album-markdown` | 专辑 Markdown 解析与校验 |
| `application/design-album` | 专辑概念 → 曲目规划 |
| `adapters/filesystem/json-album-manifest-store` | 专辑级 manifest 读写 |
| `shared/retry` | 通用重试策略 |
| `shared/timeout` | 通用超时策略 |

## 测试

```bash
pnpm test          # 运行所有测试
pnpm test:watch    # 监视模式
```

## 安全

- 不保存认证令牌、Cookie 或个人信息
- 认证信息仅存在于进程内存中
- 未经用户确认不消耗 Suno credits
- 专辑提交失败后不会自动提交剩余曲目
