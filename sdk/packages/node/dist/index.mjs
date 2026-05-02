// src/sandbox.ts
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import WebSocket from "ws";

// src/errors.ts
var CodelaveError = class extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "CodelaveError";
  }
  status;
  details;
};

// src/utils.ts
async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries) {
        throw new CodelaveError(`Network error: ${error instanceof Error ? error.message : String(error)}`);
      }
      await new Promise((resolve2) => setTimeout(resolve2, Math.pow(2, i) * 1e3));
    }
  }
  throw new CodelaveError("Unreachable");
}

// src/sandbox.ts
var DEFAULT_BASE_URL = "https://api.codelave.com";
var Sandbox = class _Sandbox {
  id;
  #apiKey;
  #baseUrl;
  constructor(id, apiKey, baseUrl) {
    this.id = id;
    this.#apiKey = apiKey;
    this.#baseUrl = baseUrl;
  }
  get headers() {
    return {
      "X-API-Key": this.#apiKey,
      "Authorization": `Bearer ${this.#apiKey}`
    };
  }
  /**
   * Creates a new isolated sandbox environment.
   */
  static async create(options) {
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
        "Authorization": `Bearer ${options.apiKey}`
      },
      body: JSON.stringify({
        template: options.template,
        timeoutMinutes: options.timeoutMinutes
      })
    });
    if (!response.ok) {
      throw new CodelaveError(`Failed to create sandbox: ${response.status} ${response.statusText}`, response.status);
    }
    const data = await response.json();
    return new _Sandbox(data.id, options.apiKey, baseUrl);
  }
  /**
   * Runs code inside the sandbox.
   */
  async runCode(code, options) {
    let ws = null;
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/execute`;
    if (options?.onOutput) {
      try {
        const wsUrl = new URL(`${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/stream`);
        wsUrl.protocol = wsUrl.protocol === "https:" ? "wss:" : "ws:";
        ws = new WebSocket(wsUrl.toString(), {
          headers: this.headers
        });
        ws.on("message", (data) => {
          options.onOutput(data.toString());
        });
        await new Promise((res, rej) => {
          ws.on("open", res);
          ws.on("error", rej);
        });
      } catch (error) {
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
          ...this.headers
        },
        body: JSON.stringify({ code })
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
      const result = await response.json();
      return {
        output: result.output ?? result.stdout ?? "",
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
        duration: result.duration ?? 0
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
  async uploadFile(localPath, remotePath) {
    const fileBuffer = readFileSync(resolve(localPath));
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append("file", blob, remotePath);
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files/upload`;
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: this.headers,
      // FormData automatically sets the proper Content-Type with boundary
      body: formData
    });
    if (!response.ok) {
      throw new CodelaveError(`Failed to upload file: ${response.status} ${response.statusText}`, response.status);
    }
  }
  /**
   * Downloads a file from the sandbox to the local filesystem.
   */
  async downloadFile(remotePath, localPath) {
    const encodedPath = encodeURIComponent(remotePath);
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files/${encodedPath}`;
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers
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
  async listFiles() {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}/files`;
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers
    });
    if (!response.ok) {
      throw new CodelaveError(`Failed to list files: ${response.status} ${response.statusText}`, response.status);
    }
    return await response.json();
  }
  /**
   * Gets the current status of the sandbox.
   */
  async getStatus() {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}`;
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: this.headers
    });
    if (!response.ok) {
      throw new CodelaveError(`Failed to get status: ${response.status} ${response.statusText}`, response.status);
    }
    return await response.json();
  }
  /**
   * Destroys the sandbox environment manually.
   */
  async destroy() {
    const url = `${this.#baseUrl.replace(/\/$/, "")}/sandbox/${this.id}`;
    const response = await fetchWithRetry(url, {
      method: "DELETE",
      headers: this.headers
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
      console.error("Failed to cleanly dispose sandbox on exit");
    }
  }
};

// src/index.ts
if (typeof Symbol !== "undefined" && !Symbol.asyncDispose) {
  Object.defineProperty(Symbol, "asyncDispose", {
    value: /* @__PURE__ */ Symbol("Symbol.asyncDispose")
  });
}
export {
  CodelaveError,
  Sandbox
};
//# sourceMappingURL=index.mjs.map