import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import WebSocket from "ws";
import { CodelaveError } from "./errors";
import { fetchWithRetry } from "./utils";
import { SandboxOptions, RunCodeOptions, RunCodeResult, SandboxStatus, FileInfo } from "./types";

const DEFAULT_BASE_URL = "https://api.codelave.com";

export class Sandbox {
  public readonly id: string;
  readonly #apiKey: string;
  readonly #baseUrl: string;

  private constructor(id: string, apiKey: string, baseUrl: string) {
    this.id = id;
    this.#apiKey = apiKey;
    this.#baseUrl = baseUrl;
  }

  private get headers(): Record<string, string> {
    return {
      "X-API-Key": this.#apiKey,
      "Authorization": `Bearer ${this.#apiKey}`,
    };
  }

  /**
   * Creates a new isolated sandbox environment.
   */
  static async create(options: SandboxOptions): Promise<Sandbox> {
    if (!options.apiKey) {
      throw new CodelaveError("API key is required");
    }

    const baseUrl = options.baseUrl || process.env.CODELAVE_BASE_URL || DEFAULT_BASE_URL;
    const url = `${baseUrl.replace(/\/$/, "")}/sandbox`;

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": options.apiKey,
        "Authorization": `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        template: options.template,
        timeoutMinutes: options.timeoutMinutes,
      }),
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to create sandbox: ${response.status} ${response.statusText}`, response.status);
    }

    const data = await response.json() as { id: string };
    return new Sandbox(data.id, options.apiKey, baseUrl);
  }

  /**
   * Runs code inside the sandbox.
   */
  async runCode(code: string, options?: RunCodeOptions): Promise<RunCodeResult> {
    let ws: WebSocket | null = null;
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/execute`;

    if (options?.onOutput) {
      // Connect to WebSocket for streaming
      try {
        const wsUrl = new URL(`${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/stream`);
        wsUrl.protocol = wsUrl.protocol === "https:" ? "wss:" : "ws:";

        ws = new WebSocket(wsUrl.toString(), {
          headers: this.headers,
        });

        ws.on("message", (data) => {
          options.onOutput!(data.toString());
        });

        await new Promise<void>((res, rej) => {
          ws!.on("open", res);
          ws!.on("error", rej);
        });
      } catch (error) {
        // If WS connection fails, we log it and continue with HTTP execution
        console.warn("Failed to connect to streaming WebSocket. Output will not be streamed.", error);
        if (ws) {
          ws.close();
          ws = null;
        }
      }
    }

    try {
      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new CodelaveError(`Authentication failed. Please check your API key.`, response.status);
        }
        if (response.status === 408 || response.status === 504) {
          throw new CodelaveError(`Execution timed out after exceeding the limit.`, response.status);
        }
        throw new CodelaveError(`Execution failed: ${response.status} ${response.statusText}`, response.status);
      }

      const result = await response.json() as RunCodeResult;
      return {
        output: result.output ?? result.stdout ?? "",
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
        duration: result.duration ?? 0,
      };
    } finally {
      if (ws) {
        ws.close();
      }
    }
  }

  /**
   * Uploads a local file into the sandbox.
   */
  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    const fileBuffer = readFileSync(resolve(localPath));
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append("file", blob, remotePath);

    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files/upload`;
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: this.headers, // FormData automatically sets the proper Content-Type with boundary
      body: formData,
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to upload file: ${response.status} ${response.statusText}`, response.status);
    }
  }

  /**
   * Downloads a file from the sandbox to the local filesystem.
   */
  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    const encodedPath = encodeURIComponent(remotePath);
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files/${encodedPath}`;
    
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to download file: ${response.status} ${response.statusText}`, response.status);
    }

    const arrayBuffer = await response.arrayBuffer();
    writeFileSync(resolve(localPath), Buffer.from(arrayBuffer));
  }

  /**
   * Lists all files in the sandbox.
   */
  async listFiles(): Promise<FileInfo[]> {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files`;
    
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to list files: ${response.status} ${response.statusText}`, response.status);
    }

    return await response.json() as FileInfo[];
  }

  /**
   * Gets the current status of the sandbox.
   */
  async getStatus(): Promise<SandboxStatus> {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}`;
    
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to get status: ${response.status} ${response.statusText}`, response.status);
    }

    return await response.json() as SandboxStatus;
  }

  /**
   * Destroys the sandbox environment manually.
   */
  async destroy(): Promise<void> {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}`;
    
    const response = await fetchWithRetry(url, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new CodelaveError(`Failed to destroy sandbox: ${response.status} ${response.statusText}`, response.status);
    }
  }

  /**
   * Supports the context manager pattern for auto destruction using 'await using'.
   */
  async [Symbol.asyncDispose]() {
    try {
      await this.destroy();
    } catch (err) {
      // Avoid unhandled rejections during auto-cleanup but do not log sensitive info
      console.error("Failed to cleanly dispose sandbox on exit");
    }
  }
}
