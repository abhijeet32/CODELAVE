// A simple script to test sandbox creation and execution against your local Codelave Server
// To run this: node test_sandbox_api.js

const SERVER_URL = "http://localhost:3000"; 
const API_KEY = "clv_97b2795751724bed9f127b0461041c096fc6dd0ab37a328d"; // Valid local testing key

const simplePythonProject = `
def fibonacci(n):
    if n <= 0: return []
    elif n == 1: return [0]
    result = [0, 1]
    for _ in range(2, n):
        result.append(result[-1] + result[-2])
    return result

print('🚀 Running Fibonacci Project inside Codelave Sandbox!')
print('First 15 Fibonacci numbers:')
print(fibonacci(15))
`;

async function testSandbox() {
  console.log("🚀 Testing Sandbox Creation...");

  try {
    // 1. Create a Sandbox
    const createRes = await fetch(`${SERVER_URL}/sandbox`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ template: 'python:3.11' })
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create sandbox: ${await createRes.text()}`);
    }

    const sandbox = await createRes.json();
    console.log(`✅ Sandbox created successfully! ID: ${sandbox.id}`);

    // 2. Execute Code inside the Sandbox
    console.log("🚀 Executing simple Python project inside the Sandbox...");
    
    const executeRes = await fetch(`${SERVER_URL}/sandbox/${sandbox.id}/execute`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: 'python',
        code: simplePythonProject
      })
    });

    if (!executeRes.ok) {
      throw new Error(`Failed to execute code: ${await executeRes.text()}`);
    }

    const execution = await executeRes.json();
    
    console.log("\n--- 📝 EXECUTION RESULTS ---");
    if (execution.output) {
      console.log(execution.output.trim());
    }
    if (execution.error) {
      console.error("ERROR:", execution.error.trim());
    }
    console.log(`⏱️ Duration: ${execution.durationMs}ms`);
    console.log("----------------------------\n");

    // 3. Destroy Sandbox (Clean up)
    console.log("🧹 Destroying the Sandbox to clean up...");
    const deleteRes = await fetch(`${SERVER_URL}/sandbox/${sandbox.id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_KEY,
      }
    });

    if (!deleteRes.ok) {
      throw new Error(`Failed to destroy sandbox: ${await deleteRes.text()}`);
    }
    
    console.log(`✅ Sandbox ${sandbox.id} destroyed successfully!`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testSandbox();
