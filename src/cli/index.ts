#!/usr/bin/env node

/**
 * Suno Writer CLI — 仅负责解析参数、调用用例和输出结果。
 *
 * 命令：
 *   validate       <markdown-file> 校验歌曲 Markdown
 *   validate-album <markdown-file> 校验专辑 Markdown
 *   design-album   <concept.json>  设计专辑模板
 *   resume         <batch-dir>     恢复未完成批次
 *   doctor                        环境预检
 *
 * 所有命令使用稳定 JSON 信封输出。
 */
import { readFileSync } from "node:fs";
import { ok, err, type ResultEnvelope } from "../shared/result.js";
import { ErrorCodes } from "../domain/errors.js";

export type Command = "validate" | "design-album" | "validate-album" | "resume" | "doctor";

export interface CliArgs {
  command: Command;
  input: string;
  options: Record<string, string>;
}

/**
 * 解析 CLI 参数。
 */
export function parseArgs(args: string[]): ResultEnvelope<CliArgs> {
  const [,, command, ...rest] = args;

  if (!command) {
    return err(
      ErrorCodes.INTERNAL_ERROR,
      "用法: suno-writer <validate|design-album|validate-album|resume|doctor> [input] [options]",
    );
  }

  const validCommands: Command[] = ["validate", "design-album", "validate-album", "resume", "doctor"];
  if (!validCommands.includes(command as Command)) {
    return err(
      ErrorCodes.INTERNAL_ERROR,
      `未知命令: ${command}。可用命令: ${validCommands.join(", ")}`,
    );
  }

  // 第一个非 option 参数作为 input；doctor 不要求位置参数。
  let input = "";
  const options: Record<string, string> = {};
  for (const arg of rest) {
    if (arg.startsWith("--")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      const value = valueParts.join("=") || "true";
      if (key) options[key] = value;
    } else if (!input) {
      input = arg;
    }
  }

  if (command !== "doctor" && !input) {
    return err(
      ErrorCodes.INTERNAL_ERROR,
      `命令 ${command} 需要输入参数`,
    );
  }

  return ok({ command: command as Command, input, options });
}

/**
 * 读取输入文件内容。
 */
export function readInputFile(filePath: string): ResultEnvelope<string> {
  try {
    const content = readFileSync(filePath, "utf-8");
    return ok(content);
  } catch (error) {
    return err(
      ErrorCodes.FILE_NOT_FOUND,
      `无法读取文件: ${filePath}`,
    );
  }
}
