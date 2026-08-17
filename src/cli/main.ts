#!/usr/bin/env node

/**
 * Suno Writer — 主入口
 *
 * CLI 仅负责解析参数、调用用例和输出结果。
 */
import { parseArgs } from "./index.js";
import { runValidate } from "./validate-command.js";
import { runResume } from "./resume-command.js";
import { runValidateAlbum } from "./validate-album-command.js";
import { runDesignAlbum } from "./design-album-command.js";
import { runDoctorCommand } from "./doctor-command.js";
import type { ResultEnvelope } from "../shared/result.js";

async function main(): Promise<void> {
  const args = process.argv;
  const parsed = parseArgs(args);

  if (!parsed.ok) {
    console.error(JSON.stringify(parsed, null, 2));
    process.exit(1);
  }

  let result: ResultEnvelope<unknown>;

  switch (parsed.data.command) {
    case "validate":
      result = await runValidate(args);
      break;
    case "validate-album":
      result = await runValidateAlbum(args);
      break;
    case "design-album":
      result = await runDesignAlbum(args);
      break;
    case "resume":
      result = await runResume(args);
      break;
    case "doctor":
      result = await runDoctorCommand(args);
      break;
    default:
      result = {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: `未知命令: ${parsed.data.command}`,
        },
        warnings: [],
      };
  }

  const output = JSON.stringify(result, null, 2);
  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : String(error),
        },
        warnings: [],
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
