# Suno 接口集成说明

> 参考：§10 已验证的 Suno 完整链路、§11 鉴权与网络约束

## 接口总览

以下接口来自 Suno 网页操作的观察，属于私有接口，非官方稳定 API。

### 1. 歌词草稿项目

```
POST /api/lyrics-projects
POST /api/lyrics-projects/<id>/flush
```

### 2. 提交生成（主接口）

```
POST https://studio-api-prod.suno.com/api/generate/v2-web/
```

请求体核心字段：

```json
{
  "generation_type": "TEXT",
  "title": "歌曲名称",
  "tags": "English Style",
  "negative_tags": "",
  "mv": "模型内部名称",
  "prompt": "带技术标签歌词",
  "make_instrumental": false,
  "metadata": {
    "create_mode": "custom"
  },
  "transaction_uuid": "动态 UUID",
  "lyrics_project_id": "动态歌词项目 ID"
}
```

响应包含：
- 批次 ID
- `batch_size: 2`
- 两个 clip 对象及其 ID

### 3. 查询生成状态

```
POST https://studio-api-prod.suno.com/api/feed/v3
```

```json
{
  "filters": {
    "ids": {
      "presence": "True",
      "clipIds": ["clip-id-1", "clip-id-2"]
    }
  },
  "limit": 2
}
```

状态变化：`submitted → streaming → complete`

完成判据：
1. clip 状态进入 complete
2. `download_song.disabled == false`

### 4. WAV 转换

触发转换：
```
POST https://studio-api-prod.suno.com/api/gen/<clip-id>/convert_wav/
→ 204 No Content
```

轮询获取 URL：
```
GET https://studio-api-prod.suno.com/api/gen/<clip-id>/wav_file/
→ {"wav_file_url": "https://cdn1.suno.ai/<clip-id>.wav"}
```

## 鉴权要求

除 Cookie 外，还依赖动态认证信息：
- `Authorization: Bearer <token>`
- `browser-token`
- `device-id`
- 动态 session token
- 动态 transaction UUID

认证信息：
- 仅保存于进程内存
- 不序列化、不写入日志或 manifest
- 失效时通过浏览器重新登录获取

## 网络阶段

1. **必须访问 Suno 的阶段**：登录、填写、提交、状态查询、WAV 转换
2. **CDN 下载阶段**：取得 `wav_file_url` 后下载大文件

建议：
- 提交前检查 Suno 可访问性
- 网络不可用时明确失败，不自动重复提交
- WAV CDN 下载支持超时和有限次数重试
- 已有完整文件时不重复下载

## 接口访问策略（接口增强模式）

1. 创建默认仍由 Suno 页面触发
2. 监听生成响应提取 batch 和 clip ID
3. 状态查询优先走 feed/v3
4. WAV 转换优先走 convert_wav + wav_file
5. CDN 地址直接下载
6. 接口变化时回退 UI，不让整体工作流完全失效

## 实测验证（2026-08-05）

测试歌曲：《月下独酌》  
一次提交成功生成两首：

| 版本 | 时长 | 格式 |
|---|---|---|
| 版本 1 | 177.64 秒 | PCM WAV, 48kHz, 16-bit, Stereo |
| 版本 2 | 177.32 秒 | PCM WAV, 48kHz, 16-bit, Stereo |
