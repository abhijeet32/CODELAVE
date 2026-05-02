export interface SandboxOptions {
  /** The API key for Codelave platform */
  apiKey: string;
  /** The template to use for the sandbox (e.g., 'python', 'node', 'java', 'research') */
  template: string;
  /** Optional custom timeout for the sandbox in minutes */
  timeoutMinutes?: number;
  /** Base URL for the Codelave API. Defaults to environment variable CODELAVE_BASE_URL or https://api.codelave.com */
  baseUrl?: string;
}

export interface RunCodeOptions {
  /** Callback for streaming output line by line as it executes */
  onOutput?: (chunk: string) => void;
}

export interface RunCodeResult {
  output: string;
  stdout: string;
  stderr: string;
  duration: number;
}

export interface SandboxStatus {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface FileInfo {
  name: string;
  size?: number;
  [key: string]: unknown;
}
