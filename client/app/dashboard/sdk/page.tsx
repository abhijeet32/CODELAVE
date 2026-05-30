import fs from 'fs';
import path from 'path';
import SDKClientPage from './SDKClientPage';

// Define the absolute paths to the SDK files
// In a real production deployment, this might need to be adjusted or pre-built
const SDK_PATH = path.resolve(process.cwd(), '../sdk/packages');

interface SDKMethod {
  name: string;
  signature: string;
  description: string;
}

interface SDKInfo {
  language: string;
  methods: SDKMethod[];
}

function parseNodeSDK(): SDKInfo {
  try {
    const filePath = path.join(SDK_PATH, 'node/src/sandbox.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Naive regex to extract JSDoc and method signature
    // Matches: /** ... */ async methodName(...)
    const methodRegex = /\/\*\*([\s\S]*?)\*\/\s*(?:static\s+)?(?:async\s+)?([\w\[\]\.]+)\s*\((.*?)\)(?:\s*:\s*([^\{]+))?/g;
    
    const methods: SDKMethod[] = [];
    let match;
    
    while ((match = methodRegex.exec(content)) !== null) {
      const description = match[1].replace(/\s*\*\s?/g, ' ').trim();
      const name = match[2];
      
      // Skip the [Symbol.asyncDispose] method for cleaner UI
      if (name.includes('Symbol.asyncDispose')) continue;
      
      const params = match[3];
      const returnType = match[4] ? `: ${match[4].trim()}` : '';
      
      methods.push({
        name,
        signature: `${name}(${params})${returnType}`,
        description
      });
    }
    
    return { language: 'Node.js', methods };
  } catch (error) {
    console.error("Failed to parse Node SDK:", error);
    return { language: 'Node.js', methods: [] };
  }
}

function parsePythonSDK(): SDKInfo {
  try {
    const filePath = path.join(SDK_PATH, 'python/src/codelave/sandbox.py');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Naive regex for python methods and docstrings
    // Matches: async def methodName(...): \n """docstring"""
    const methodRegex = /(?:@classmethod\s*)?(?:async\s+)?def\s+([\w_]+)\s*\(([\s\S]*?)\)(?:\s*->\s*([^:]+))?:\s*"""([\s\S]*?)"""/g;
    
    const methods: SDKMethod[] = [];
    let match;
    
    while ((match = methodRegex.exec(content)) !== null) {
      const name = match[1];
      
      // Skip private methods
      if (name.startsWith('_')) continue;
      
      const params = match[2].replace(/\s+/g, ' ').trim();
      const returnType = match[3] ? ` -> ${match[3].trim()}` : '';
      const description = match[4].trim();
      
      methods.push({
        name,
        signature: `def ${name}(${params})${returnType}`,
        description
      });
    }
    
    return { language: 'Python', methods };
  } catch (error) {
    console.error("Failed to parse Python SDK:", error);
    return { language: 'Python', methods: [] };
  }
}

export default async function SDKIntegrationPage() {
  const nodeSDK = parseNodeSDK();
  const pythonSDK = parsePythonSDK();
  
  const sdks = [nodeSDK, pythonSDK];

  return <SDKClientPage sdks={sdks} />;
}
