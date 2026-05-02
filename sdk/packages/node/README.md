# Codelave Node.js SDK

Official Node.js/TypeScript SDK for [Codelave](https://codelave.com) - a managed code execution infrastructure platform that provides secure isolated sandbox environments.

## Installation

```bash
npm install @codelave/node
```

## Quickstart

```typescript
import { Sandbox } from "@codelave/node";

async function main() {
  // 1. Create a sandbox
  // Using the context manager pattern (await using) ensures the sandbox
  // is automatically destroyed when the block exits.
  await using sandbox = await Sandbox.create({
    apiKey: "YOUR_API_KEY", // Keep this safe! Do not hardcode in production
    template: "python", // 'python', 'node', 'java', 'research'
    timeoutMinutes: 30
  });

  console.log(`Sandbox created with ID: ${sandbox.id}`);

  // 2. Run some code
  const result = await sandbox.runCode("print('Hello from Codelave!')");
  console.log("Output:", result.output);
  console.log(`Execution took ${result.duration}ms`);

  // 3. File Operations
  await sandbox.uploadFile("./data.csv", "data.csv");
  await sandbox.runCode("import pandas as pd; df = pd.read_csv('data.csv'); print(df.head())");
  await sandbox.downloadFile("output.png", "./output.png");

  // 4. Streaming Output (Real-time logs)
  await sandbox.runCode("import time; for i in range(5): print(i); time.sleep(1)", {
    onOutput: (chunk) => console.log("Stream:", chunk)
  });
}

main().catch(console.error);
```

## Security & Best Practices

- **Never** log or print the Sandbox instance directly, though the SDK handles storing the API key securely.
- Only the `id` of the Sandbox is publicly readable from the class. The API keys are encapsulated securely.
- Leverage the ES `await using` syntax (explicit resource management) to ensure sandboxes are reliably garbage collected/destroyed.
