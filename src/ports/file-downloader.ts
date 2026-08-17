/**
 * File Downloader 端口 — §11.2 §15 §16.5
 *
 * 负责从 URL 流式下载文件到本地。
 * 适配器：Node.js 原生 fetch + stream。
 */
export interface FileDownloader {
  /**
   * 从 URL 下载文件到指定目录。
   * 使用临时文件名 (.part)，完成后原子重命名。
   *
   * @param url - 下载 URL
   * @param destDir - 目标目录
   * @param filename - 目标文件名
   * @param expectedSha256 - 可选的预期 SHA256 校验值
   * @returns 下载后的文件路径
   */
  download(
    url: string,
    destDir: string,
    filename: string,
    expectedSha256?: string,
  ): Promise<string>;

  /**
   * 检查 URL 是否可访问（HEAD 请求）。
   */
  checkUrlAccessible(url: string): Promise<boolean>;
}
