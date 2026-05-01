# Codelave SDK

**Official client SDKs for the Codelave code execution platform.**

This monorepo contains the Node.js and Python SDKs that let you create secure sandbox environments, execute code, upload/download files, and stream output in real time — all with a single API key.

---

## Packages

| Package | Language | Install | Status |
|---------|----------|---------|--------|
| [@codelave/node](./packages/node) | TypeScript / Node.js | `npm install @codelave/node` | ✅ Ready |
| [codelave](./packages/python) | Python | `pip install codelave` | ✅ Ready |

---

## Quick Start

### Node.js / TypeScript

```bash
npm install @codelave/node
```

```typescript
import { Sandbox } from "@codelave/node";

// Create a sandbox and auto-destroy when done
await using sandbox = await Sandbox.create({
  apiKey: "clv_your_api_key_here",
  template: "python3",
});

// Execute code
const result = await sandbox.runCode('print("Hello from Codelave!")');
console.log(result.output); // Hello from Codelave!

// Stream output in real time
const result2 = await sandbox.runCode(
  'for i in range(5): print(f"Step {i}")',
  { onOutput: (chunk) => process.stdout.write(chunk) }
);

// Upload and download files
await sandbox.uploadFile("./data.csv", "data.csv");
const files = await sandbox.listFiles();
await sandbox.downloadFile("results.json", "./results.json");
```

### Python

```bash
pip install codelave
```

```python
from codelave import Sandbox

# Using async context manager for automatic cleanup
async with await Sandbox.create(
    api_key="clv_your_api_key_here",
    template="python3",
) as sandbox:
    # Execute code
    result = await sandbox.run_code('print("Hello from Codelave!")')
    print(result["output"])  # Hello from Codelave!

    # Stream output
    async def on_output(chunk: str):
        print(chunk, end="")

    result = await sandbox.run_code(
        'for i in range(5): print(f"Step {i}")',
        on_output=on_output,
    )

    # File operations
    await sandbox.upload_file("./data.csv", "data.csv")
    files = await sandbox.list_files()
    await sandbox.download_file("results.json", "./results.json")
```

---

## Features

| Feature | Node.js | Python |
|---------|---------|--------|
| Create / destroy sandboxes | ✅ | ✅ |
| Execute code (sync) | ✅ | ✅ |
| Stream output (WebSocket) | ✅ | ✅ |
| Upload files | ✅ | ✅ |
| Download files | ✅ | ✅ |
| List files | ✅ | ✅ |
| Get sandbox status | ✅ | ✅ |
| Auto-cleanup (`await using` / `async with`) | ✅ | ✅ |
| Retry with backoff | ✅ | ✅ |
| TypeScript types / Python typing | ✅ | ✅ |

---

## API Reference

### `Sandbox.create(options)`

Creates a new isolated sandbox environment.

**Node.js:**
```typescript
const sandbox = await Sandbox.create({
  apiKey: string,          // Required — your Codelave API key
  template: string,        // Required — "python3", "node", "ubuntu", etc.
  timeoutMinutes?: number, // Optional — auto-destroy timeout (default: 5)
  baseUrl?: string,        // Optional — API base URL
});
```

**Python:**
```python
sandbox = await Sandbox.create(
    api_key="...",           # Required
    template="python3",     # Required
    timeout_minutes=5,      # Optional
    base_url="...",         # Optional
)
```

### `sandbox.runCode(code, options?)` / `sandbox.run_code(code, on_output?)`

Executes code inside the sandbox and returns the result.

**Returns:**
```
{
  output: string,   // Combined stdout
  stdout: string,   // Standard output
  stderr: string,   // Standard error
  duration: number  // Execution time in ms
}
```

### `sandbox.uploadFile(localPath, remotePath)` / `sandbox.upload_file(...)`
Uploads a local file into the sandbox container.

### `sandbox.downloadFile(remotePath, localPath)` / `sandbox.download_file(...)`
Downloads a file from the sandbox to the local filesystem.

### `sandbox.listFiles()` / `sandbox.list_files()`
Returns a list of all files in the sandbox.

### `sandbox.getStatus()` / `sandbox.get_status()`
Returns the current status of the sandbox (`RUNNING`, `STOPPED`, etc.).

### `sandbox.destroy()`
Manually destroys the sandbox and its container.

---

## Authentication

1. Register at the Codelave dashboard
2. Generate an API key (`POST /auth/apikey`)
3. Pass the key to `Sandbox.create()`:

```typescript
// Node.js — via constructor
Sandbox.create({ apiKey: "clv_..." });

// Or via environment variable
// Set CODELAVE_API_KEY in your environment
```

> **Security:** API keys are stored hashed (SHA-256) on the server. The plain key is shown **only once** at creation time. Never commit keys to version control.

---

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `CODELAVE_BASE_URL` | API server URL | `https://api.codelave.com` |
| `CODELAVE_API_KEY`  | Default API key | — |

---

## Development

### Monorepo Structure
```
sdk/
├── package.json           # Workspace root
├── packages/
│   ├── node/              # Node.js/TypeScript SDK
│   │   ├── src/
│   │   │   ├── index.ts   # Entry point + exports
│   │   │   ├── sandbox.ts # Sandbox class
│   │   │   ├── types.ts   # TypeScript interfaces
│   │   │   ├── errors.ts  # Error classes
│   │   │   └── utils.ts   # Retry logic
│   │   ├── package.json
│   │   └── tsup.config.ts # Build config
│   └── python/            # Python SDK
│       ├── src/codelave/
│       │   ├── __init__.py
│       │   ├── sandbox.py # Sandbox class
│       │   ├── types.py   # Type definitions
│       │   ├── errors.py  # Error classes
│       │   └── utils.py   # Retry logic
│       └── pyproject.toml
```

### Build Node.js SDK
```bash
cd packages/node
npm run build
```

### Build Python SDK
```bash
cd packages/python
pip install -e .
```

---

## License

MIT
