export type DoctorCheckStatus = "pass" | "fail" | "warning" | "skipped";

export interface DoctorCheck {
  id: string;
  status: DoctorCheckStatus;
  required: boolean;
  message: string;
  evidence?: Record<string, string | number | boolean | null>;
}

export interface DoctorOptions {
  proxyServer?: string;
  proxySource?: "option" | "environment";
}

export interface DoctorProbeResult {
  selectedProxy?: string;
  proxySource?: "option" | "environment" | "system" | "discovered" | "direct";
  checks: DoctorCheck[];
}

export interface DoctorProbe {
  run(options: DoctorOptions): Promise<DoctorProbeResult>;
}
