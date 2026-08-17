import { NodeDoctorProbe } from "../adapters/diagnostics/node-doctor-probe.js";
import { runDoctor } from "../application/run-doctor.js";
import type { ResultEnvelope } from "../shared/result.js";
import { parseArgs } from "./index.js";

export async function runDoctorCommand(args: string[]): Promise<ResultEnvelope<unknown>> {
  const parsed = parseArgs(args);
  if (!parsed.ok) return parsed;

  const optionProxy = parsed.data.options["proxy"];
  const environmentProxy = process.env.SUNO_PROXY;
  const proxyServer = optionProxy ?? environmentProxy;

  return runDoctor({
    probe: new NodeDoctorProbe(),
    ...(proxyServer ? { proxyServer } : {}),
    ...(optionProxy ? { proxySource: "option" as const } : environmentProxy ? { proxySource: "environment" as const } : {}),
  });
}
