# Suno 浏览器适配与提交核对

仅在使用 Agent `browser_*` 工具提交、排查 Create 后结果或维护浏览器交互流程时读取。

## 适配边界

CLI 负责校验、doctor、manifest、状态跟踪和下载；Agent 只负责用户可见的 Suno 浏览器交互。不要从 skill 或临时脚本调用 Suno 私有接口，也不要把浏览器内部选择器写进业务 CLI。

## 推荐表单流程

1. 提交前对当前曲目重新运行 `pnpm doctor`；仅当 `safeToSubmit=true` 时继续，并原样复用 `selectedProxy`。
2. 打开 `https://suno.com/create`，等待页面稳定；登录、Cloudflare 人工检测由用户完成。
3. 选择 Advanced 模式，确认当前表单为空或先清空旧草稿。
4. 填写三个字段：
   - `Lyrics editor`：`contenteditable` 编辑器；使用可触发页面状态更新的 Playwright `fill()` 或等价交互，并回读字符数/内容确认。
   - `Styles`：当前页面实现为 `textarea`，不要假定它是 `input`；回读长度和内容确认。
   - `Song Title (Optional)`：可见的 `input`；填写后回读值确认。
5. 不依赖快照中的 `ref`、textbox 序号或固定 DOM 层级。页面重渲染后必须重新 snapshot/按可访问名称、placeholder、role 定位；textbox 序号只能作为当次页面诊断结果，不能固化到脚本。
6. 在用户明确授权本次 credits 后点击 `Create song`。

## Create 后的确定性核对

至少需要一个可审计的成功证据：

- 生成请求响应中的真实 `batch_id`、clip IDs 和模型字段；或
- 页面成功出现本次标题对应的两个 clip，且能取得稳定的 song/clip ID，并与真实响应或后续状态核对。

仅看到“Create 按钮点击成功”、credits 计数变化、或页面出现标题，不能证明提交成功。若没有真实 `batchId`，不要猜测、顺序生成或伪造 UUID；manifest 应标记 `unknown_submission_state` 并停止后续曲目，等待恢复核对。

页面出现两个链接可作为 UI 证据，但不能自动推导 batch ID。捕获网络请求时只读取生成响应中用于状态跟踪的非敏感业务字段；不要读取、记录或持久化 `Authorization`、Cookie、browser token、device ID 等认证信息。

## 失败与人工检测

- 导航超时、网络错误或代理变化：停止并重新运行 doctor，不用临时 curl/端口扫描猜测。
- 出现 Cloudflare/真人检测：只提示用户手动完成；不得代点、绕过或注入脚本规避。
- 点击 Create 后无法证明成功或失败：立即停止，标记 `unknown_submission_state`，先核对曲库和已有 manifest，不自动重试。

## manifest 最小要求

写入真实数据：`taskId`、标题、slug、`submittedAt`、真实 `batchId`（若已取得）、真实 clip IDs、输入内容 SHA-256、每个 clip 的状态。认证令牌、Cookie、个人信息和设备标识永不写入 manifest。

如果当前浏览器流程无法取得真实 batch ID，应先修复捕获/核对流程或使用恢复文档；不得用模型生成的 batch ID 代替。
