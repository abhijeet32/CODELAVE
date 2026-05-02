interface SandboxOptions {
    /** The API key for Codelave platform */
    apiKey: string;
    /** The template to use for the sandbox (e.g., 'python', 'node', 'java', 'research') */
    template: string;
    /** Optional custom timeout for the sandbox in minutes */
    timeoutMinutes?: number;
    /** Base URL for the Codelave API. Defaults to environment variable CODELAVE_BASE_URL or https://api.codelave.com */
    baseUrl?: string;
}
interface RunCodeOptions {
    /** Callback for streaming output line by line as it executes */
    onOutput?: (chunk: string) => void;
}
interface RunCodeResult {
    output: string;
    stdout: string;
    stderr: string;
    duration: number;
}
interface SandboxStatus {
    id: string;
    status: string;
    [key: string]: unknown;
}
interface FileInfo {
    name: string;
    size?: number;
    [key: string]: unknown;
}

declare class Sandbox {
    #private;
    readonly id: string;
    private constructor();
    private get headers();
    /**
     * Creates a new isolated sandbox environment.
     */
    static create(options: SandboxOptions): Promise<Sandbox>;
    /**
     * Runs code inside the sandbox.
     */
    runCode(code: string, options?: RunCodeOptions): Promise<RunCodeResult>;
    /**
     * Uploads a local file into the sandbox.
     */
    uploadFile(localPath: string, remotePath: string): Promise<void>;
    /**
     * Downloads a file from the sandbox to the local filesystem.
     */
    downloadFile(remotePath: string, localPath: string): Promise<void>;
    /**
     * Lists all files in the sandbox.
     */
    listFiles(): Promise<FileInfo[]>;
    /**
     * Gets the current status of the sandbox.
     */
    getStatus(): Promise<SandboxStatus>;
    /**
     * Destroys the sandbox environment manually.
     */
    destroy(): Promise<void>;
    /**
     * Supports the context manager pattern for auto destruction using 'await using'.
     */
    [Symbol.asyncDispose](): Promise<void>;
}

declare class CodelaveError extends Error {
    readonly status?: number | undefined;
    readonly details?: unknown | undefined;
    constructor(message: string, status?: number | undefined, details?: unknown | undefined);
}

export { CodelaveError, type FileInfo, type RunCodeOptions, type RunCodeResult, Sandbox, type SandboxOptions, type SandboxStatus };
