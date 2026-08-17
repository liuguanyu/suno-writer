# 提交前环境预检

在任何 Suno 提交前读取；用户要求排查代理或网络问题时也读取。

## 原则

`doctor` 是网络和代理可用性的确定性事实源。模型不得用临时 curl、端口扫描、浏览器试错或经验猜测替代它。

代理选择优先级由 CLI 决定：

1. `--proxy`
2. `SUNO_PROXY`
3. macOS 系统代理
4. 直连

在项目根目录运行：

```bash
pnpm doctor [--proxy=<proxy-url>]
```

## 读取报告

以结构化 JSON 为准：

- `safeToSubmit=true`：环境闸门通过，可进入提交阶段。
- `safeToSubmit=false` 或 `DOCTOR_CHECK_FAILED`：停止，不点击 Create；向用户报告失败检查及建议动作。
- `selectedProxy`：提交时唯一允许使用的代理值。非空则 Agent 浏览器必须使用该代理；为空则直连。
- 不要根据某个单项成功自行覆盖 `safeToSubmit` 总结论。

即使失败信封出现在 stderr，完整报告也可能位于 `error.details`；按结构化字段读取，不解析人类日志推断结果。

## 常见失败处理

- **代理端口不可达 / Suno Web 或 API 不可达**：请用户恢复网络或代理后重新运行 doctor。不要自动切换到猜测端口。
- **node-version 不满足**：升级 Node.js >= 22。

## 时效与交接

提交应紧接一次成功 doctor，复用同一 `selectedProxy`。网络或代理状态发生变化后，旧报告失效，必须重新检查并重新确认提交条件。
