# Codelave Python SDK

Official Python SDK for [Codelave](https://codelave.com) - a managed code execution infrastructure platform that provides secure isolated sandbox environments.

## Installation

```bash
pip install codelave
```

## Quickstart

```python
import asyncio
from codelave import Sandbox

async def main():
    # 1. Create a sandbox
    # Using the context manager pattern (async with) ensures the sandbox
    # is automatically destroyed when the block exits.
    async with await Sandbox.create(
        api_key="YOUR_API_KEY", # Keep this safe! Do not hardcode in production
        template="python", # 'python', 'node', 'java', 'research'
        timeout_minutes=30
    ) as sandbox:
        
        print(f"Sandbox created with ID: {sandbox.id}")

        # 2. Run some code
        result = await sandbox.run_code("print('Hello from Codelave!')")
        print("Output:", result["output"])
        print(f"Execution took {result['duration']}ms")

        # 3. File Operations
        await sandbox.upload_file("./data.csv", "data.csv")
        await sandbox.run_code("import pandas as pd; df = pd.read_csv('data.csv'); print(df.head())")
        await sandbox.download_file("output.png", "./output.png")

        # 4. Streaming Output (Real-time logs)
        def on_output(chunk: str):
            print("Stream:", chunk, end="")
            
        await sandbox.run_code(
            "import time; for i in range(5): print(i); time.sleep(1)", 
            on_output=on_output
        )

if __name__ == "__main__":
    asyncio.run(main())
```

## Security & Best Practices

- **Never** log or print the Sandbox instance directly, though the SDK handles storing the API key securely.
- Only the `id` of the Sandbox is publicly readable from the class. The API keys are encapsulated securely within private fields.
- Leverage the `async with` syntax (explicit resource management) to ensure sandboxes are reliably garbage collected/destroyed when exiting blocks or handling errors.
