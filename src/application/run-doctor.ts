import { ErrorCodes } from "../domain/errors.js";
import type { DoctorCheck, DoctorOptions, DoctorProbe } from "../ports/doctor-probe.js";
import { err, ok, type ResultEnvelope } from "../shared/result.js";

export interface DoctorReport {
  safeToSubmit: boolean;
  checkedAt: string;
  selectedProxy?: string;
  proxySource?: "option" | "environment" | "system" | "discovered" | "direct";
  checks: DoctorCheck[];
}

export interface RunDoctorInput extends DoctorOptions {
  probe: DoctorProbe;
}

export async function runDoctor(input: RunDoctorInput): Promise<ResultEnvelope<DoctorReport>> {
  try {
    const result = await input.probe.run(input);
    const failedRequired = result.checks.filter(
      (check) => check.required && check.status === "fail",
    );
    const report: DoctorReport = {
      safeToSubmit: failedRequired.length === 0,
      checkedAt: new Date().toISOString(),
      ...(result.selectedProxy ? { selectedProxy: result.selectedProxy } : {}),
      ...(result.proxySource ? { proxySource: result.proxySource } : {}),
      checks: result.checks,
    };

    if (failedRequired.length > 0) {
      const summary = failedRequired.map((check) => `${check.id}: ${check.message}`).join("；");
      return err(
        ErrorCodes.DOCTOR_CHECK_FAILED,
        `环境预检未通过（${failedRequired.length} 项）: ${summary}`,
        result.checks
          .filter((check) => check.status === "warning")
          .map((check) => `${check.id}: ${check.message}`),
        report,
      );
    }

    return ok(
      report,
      result.checks
        .filter((check) => check.status === "warning")
        .map((check) => `${check.id}: ${check.message}`),
    );
  } catch (error) {
    return err(
      ErrorCodes.INTERNAL_ERROR,
      `环境预检异常: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
