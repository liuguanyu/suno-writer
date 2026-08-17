# Suno 提交、跟踪与下载工作流

仅在用户明确要求提交或继续已确认的提交时读取，同时必须读取 `doctor-workflow.md`。实现细节需要维护时再读取 `suno-integration.md`。

## 提交闸门

执行前逐项确认：

1. Markdown 已通过对应的 `pnpm validate` 或 `pnpm validate:album`。
2. 最近一次完整 `pnpm doctor` 报告明确 `safeToSubmit=true`。
3. Agent 浏览器使用 `doctor.selectedProxy`（非空时）或直连（为空时）。
4. 用户已明确授权本次 credits 消耗：单曲一个批次，或专辑准确的曲目数。
5. 当前不存在尚未核对的 `unknown_submission_state`。

任一条件不满足都停止，不打开提交捷径，也不点击 Create。

## 单曲提交流程（Agent 执行）

### 1. 准备阶段（CLI）

```bash
pnpm validate <song.md>
pnpm doctor [--proxy=<proxy-url>]
```

确认 `safeToSubmit=true` 且 `selectedProxy` 已知。

### 2. 浏览器交互（Agent browser_* 工具）

1. 打开 `https://suno.com/create`。
2. 若页面显示 "Log in"，提示用户手动登录（最长等待 5 分钟）。
3. 切换到 **Advanced** 标签页。
4. 展开 Lyrics 面板，填写歌词到 Lyrics editor。
5. 填写 Style 到 Styles 字段。
6. 填写 Title 到 Song Title 字段。
7. 用户确认后，点击 **Create song**。

### 3. 捕获并核对生成结果

点击 Create 后：

1. 轮询 `browser_network_requests`（filter 匹配 `/generate/v2-web`）直到获取到生成请求。
2. 只读取响应 body 中用于状态核对的非敏感业务字段。
3. 从真实 JSON 响应中提取：
   - `batch_id` → batchId
   - `clips[0].id` → clipId-1
   - `clips[1].id` → clipId-2
   - `model_display_name` → modelDisplayName
4. 不读取、展示、保存或传递请求中的 `Authorization`、Cookie、`browser-token`、`device-id` 等认证信息。
5. 若无法取得真实 batch ID，不得猜测或伪造 UUID；标记 `unknown_submission_state` 并停止后续提交。

若 30 秒内未出现 `generate/v2-web` 请求：
- 检查页面快照，是否有 Cloudflare 验证 → 提示用户手动完成。
- 是否有错误提示 → 报告失败，不自动重试。

### 4. 持久化（Agent 文件操作）

在 `outputs/` 下创建批次目录和 manifest：

```
outputs/<timestamp>-<slug>/
  song.md          ← 原始歌曲 Markdown
  manifest.json    ← 包含 batchId、clipIds、状态
```

manifest.json 格式：

```json
{
  "schemaVersion": 1,
  "taskId": "<uuid>",
  "title": "<song-title>",
  "slug": "<slug>",
  "status": "submitted",
  "createdAt": "<iso-timestamp>",
  "submittedAt": "<iso-timestamp>",
  "lyricsSha256": "<sha256>",
  "styleSha256": "<sha256>",
  "suno": {
    "batchId": "<batch-id>",
    "modelDisplayName": "<model>",
    "clipIds": ["<clip-1>", "<clip-2>"]
  },
  "tracks": [
    { "index": 1, "clipId": "<clip-1>", "status": "pending" },
    { "index": 2, "clipId": "<clip-2>", "status": "pending" }
  ],
  "warnings": []
}
```

### 5. 状态跟踪和 WAV（CLI）

当前项目的 `resume` 实现仍要求通过命令行参数注入认证信息，这可能暴露到进程参数列表，不符合本 Skill 的凭证安全规则。因此在实现安全的进程内浏览器会话桥接或其他受支持认证通道前，不得由 Agent 抽取凭证并调用该命令。

安全恢复能力完成后，期望入口为：

```bash
pnpm resume <batch-dir>
```

届时该命令应负责：
1. 通过已有安全会话查询两个 clip 的生成状态。
2. 状态变为 complete 后触发 WAV 转换。
3. 获取 CDN URL，流式下载并校验 RIFF/WAVE 格式。
4. 更新 manifest。

认证令牌、Cookie、动态 session/browser token、设备标识不得进入命令行、日志或 manifest。当前能力缺失时应如实报告，不得绕过。

## 专辑提交

与单曲流程相同，但按曲目顺序逐个执行步骤 2-4。每完成一首记录 manifest 后再进入下一首。

- 任一曲目失败或状态不明，立即停止，不提交剩余曲目。
- 不自动重试；交给 `recovery-workflow.md`。

## 页面与人工交互

Agent 按 `browser-adapter.md` 切换到 Suno `Advanced`，定位并回读验证 `Lyrics editor`、`Styles` 和 `Song Title`。

Cloudflare 可以在点击 Create 后出现。只能提示用户手动验证，并保持现有任务等待确定性结果；不得代点或规避。若最终未捕获可证明成功或失败的结果，状态必须记为未知，不能宣称"未消耗 credits"。

## 结束条件

只有 manifest 和结构化输出确认状态后，才可向用户声称已提交、完成或下载成功。若 Create 已点击但没有可靠响应/结果，使用 `unknown_submission_state` 并转入恢复流程。
