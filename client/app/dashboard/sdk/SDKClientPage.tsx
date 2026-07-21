"use client";

import { useState } from 'react';
import { SDKInfo } from './page';

function Toast({ message, visible }: { message: string, visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: '#10b981', color: '#fff',
      padding: '0.75rem 1.5rem', borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontWeight: 500, fontSize: '0.9rem',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease forwards'
    }}>
      {message}
    </div>
  );
}

function CodeSnippet({ code, language }: { code: string, language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic syntax highlighting for comments
  const renderHighlightedCode = (text: string) => {
    return text.split('\n').map((line, index) => {
      const commentMatch = line.match(/(\/\/|#)(.*)$/);
      if (commentMatch) {
        const matchIndex = commentMatch.index!;
        const before = line.substring(0, matchIndex);
        const comment = line.substring(matchIndex);
        return (
          <span key={index}>
            {before}
            <span style={{ color: '#4ade80' }}>{comment}</span>
            {index < text.split('\n').length - 1 ? '\n' : ''}
          </span>
        );
      }
      return (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 ? '\n' : ''}
        </span>
      );
    });
  };

  return (
    <div style={{ background: '#111111', borderRadius: '12px', border: '1px solid var(--surface-border)', overflow: 'hidden', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: '#1a1a1a', borderBottom: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{language}</span>
        <button 
          onClick={handleCopy}
          style={{ 
            background: 'none', border: 'none', color: copied ? '#10b981' : 'var(--text-secondary)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem'
          }}
          title="Copy code"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, color: '#e5e5e5' }}>
          {renderHighlightedCode(code)}
        </pre>
      </div>
      {/* Invisible style for toast animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default function SDKClientPage({ sdks }: { sdks: SDKInfo[] }) {
  // Try to default to Node.js, fallback to Python
  const defaultLang = sdks.find(s => s.language.includes('Node'))?.language || sdks[0]?.language || '';
  const [activeLang, setActiveLang] = useState(defaultLang);
  const [toastMessage, setToastMessage] = useState('');

  const activeSdk = sdks.find(s => s.language === activeLang);

  if (!activeSdk) {
    return <div className="p-8 text-gray-400">Failed to load SDK documentation.</div>;
  }

  // Intercept clicks on the page to handle global toast if needed, but our CodeSnippet handles its own state
  // We'll use the global toast for the quick install copy
  const handleInstallCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Install command copied!');
    setTimeout(() => setToastMessage(''), 2000);
  };

  const isNode = activeLang.includes('Node');

  return (
    <div className="docs-container" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <Toast message={toastMessage} visible={!!toastMessage} />

      <div className="dash-header mb-8">
        <h1 className="dash-title" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>SDK Integration</h1>
        <p className="dash-subtitle" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Follow these steps to integrate the Codelave Sandbox into your application.
        </p>
      </div>

      {/* Language Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
        {sdks.map(sdk => (
          <button
            key={sdk.language}
            onClick={() => setActiveLang(sdk.language)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: activeLang === sdk.language ? 'var(--surface-border)' : 'transparent',
              color: activeLang === sdk.language ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {sdk.language === 'Python' ? '🐍' : '📦'} {sdk.language}
          </button>
        ))}
      </div>

      {/* STEP 1 */}
      <div className="doc-step" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          1. Install the SDK
        </h2>
        <div style={{ background: '#111111', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <code style={{ color: '#e5e5e5', fontFamily: 'monospace', fontSize: '0.95rem' }}>
            {isNode ? 'npm install @codelave/sdk' : 'pip install codelave'}
          </code>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => handleInstallCopy(isNode ? 'npm install @codelave/sdk' : 'pip install codelave')}
          >
            Copy
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {isNode ? 'Works with Node.js 16+' : 'Works with Python 3.8+'}
        </p>
      </div>

      {/* STEP 2 */}
      <div className="doc-step" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          2. Initialize the Sandbox
        </h2>
        <CodeSnippet 
          language={isNode ? 'javascript' : 'python'}
          code={isNode ? `import { Sandbox } from '@codelave/sdk';

// Initialize a new isolated sandbox environment
const sandbox = await Sandbox.create({
  apiKey: "clv_live_xxxxxxxxxx",    // Replace with your actual API key
  template: "node",                 // Select environment (e.g., 'node', 'python3', 'ubuntu')
  timeoutMinutes: 15                // Optional: set maximum lifespan of the sandbox
});` : `from codelave import Sandbox

# Initialize a new isolated sandbox environment
sandbox = await Sandbox.create(
    api_key="clv_live_xxxxxxxxxx",   # Replace with your actual API key
    template="python3",              # Select environment (e.g., 'node', 'python3', 'ubuntu')
    timeout_minutes=15               # Optional: set maximum lifespan of the sandbox
)`} 
        />
      </div>

      {/* STEP 3 */}
      <div className="doc-step" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
          3. Execute Code
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Run raw code strings directly inside your initialized sandbox environment.
        </p>
        <CodeSnippet 
          language={isNode ? 'javascript' : 'python'}
          code={isNode ? `try {
  // Execute code and capture standard output
  const result = await sandbox.runCode(
    "console.log('Hello from isolated container!');"
  );
  
  console.log(result.stdout); // "Hello from isolated container!"
} catch (err) {
  console.error("Execution failed:", err.message);
} finally {
  // Always destroy the sandbox to free resources
  await sandbox.destroy();
}` : `try:
    # Execute code and capture standard output
    result = await sandbox.run_code(
        "print('Hello from isolated container!')"
    )
    
    print(result["stdout"]) # "Hello from isolated container!"
except Exception as e:
    print("Execution failed:", str(e))
finally:
    # Always destroy the sandbox to free resources
    await sandbox.destroy()`} 
        />
      </div>

      {/* DYNAMIC API REFERENCE */}
      <div className="doc-step" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--surface-border)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', color: '#fff' }}>
          Full API Reference
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Below is the complete list of methods extracted directly from the {activeLang} SDK source code.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeSdk.methods.map((method, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e5e5e5', marginBottom: '0.75rem' }}>
                {method.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                {method.description || 'No description provided.'}
              </p>
              <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #333' }}>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#93c5fd' }}>
                  {method.signature}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

