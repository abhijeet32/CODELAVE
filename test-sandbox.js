const { Sandbox } = require('./sdk/packages/node/dist/index.js');

const BASE_URL = 'http://localhost:3000';
const EMAIL = `test-dev-${Math.floor(Math.random() * 100000)}@codelave.com`;
const PASSWORD = 'password123';

async function runTest() {
  console.log('--- CODELAVE FULL INTEGRATION TEST ---');
  console.log(`Using email: ${EMAIL}`);

  // 1. Register a test usertest
  console.log('\n1. Registering user...');
  let registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!registerRes.ok) {
    const errorText = await registerRes.text();
    throw new Error(`Failed to register user: ${registerRes.status} ${errorText}`);
  }
  let registerData = await registerRes.json();
  console.log('✓ Registered successfully');

  // 2. Login user
  console.log('\n2. Logging in...');
  let loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) {
    throw new Error(`Failed to login: ${loginRes.status}`);
  }
  let loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('✓ Logged in successfully. Token received.');

  // 3. Create an API Key
  console.log('\n3. Creating API Key...');
  let apiKeyRes = await fetch(`${BASE_URL}/auth/apikey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name: 'Integration Test Key' }),
  });
  if (!apiKeyRes.ok) {
    const errorText = await apiKeyRes.text();
    throw new Error(`Failed to create API key: ${apiKeyRes.status} ${errorText}`);
  }
  let apiKeyData = await apiKeyRes.json();
  const apiKey = apiKeyData.key;
  console.log('✓ API Key created:', apiKey);

  // 4. Create Sandbox using the Node SDK
  console.log('\n4. Creating Sandbox via SDK...');
  const sandbox = await Sandbox.create({
    apiKey: apiKey,
    baseUrl: BASE_URL,
    template: 'python3',
  });
  console.log(`✓ Sandbox created. Sandbox ID: ${sandbox.id}`);

  // Schedule sandbox to destroy 2 minutes after creating
  const destroyPromise = new Promise((resolve) => {
    setTimeout(async () => {
      console.log('\n6. Destroying Sandbox (triggered by 2 min timeout)...');
      try {
        await sandbox.destroy();
        console.log('✓ Sandbox destroyed successfully.');
      } catch (err) {
        console.error('Failed to destroy sandbox:', err.message);
      }
      resolve();
    }, 120000);
  });

  // 5. Execute Code inside Sandbox
  console.log('\n5. Executing Python code inside Sandbox...');
  const code = `
def greet(name):
    return f"Hello, {name}! Welcome to Codelave."

print(greet("AI developer"))
`;
  const result = await sandbox.runCode(code);
  console.log('✓ Code execution finished.');
  console.log('Execution Duration:', result.duration, 'ms');
  console.log('Stdout output:');
  console.log('-----------------------------');
  console.log(result.stdout || result.output);
  console.log('-----------------------------');

  if (result.stderr) {
    console.error('Stderr output:', result.stderr);
  }

  // Wait for the sandbox to be destroyed after the 2 minute timeout
  await destroyPromise;

  console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

runTest().catch((err) => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
