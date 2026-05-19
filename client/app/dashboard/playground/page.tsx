"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getApiKey, createSandbox, destroySandbox, executeCode, type SandboxResponse } from '@/lib/api';

export default function PlaygroundPage() {
  const [hasApiKey, setHasApiKey] = useState(true);
  const [template, setTemplate] = useState('python3');
  const [timeoutSecs, setTimeoutSecs] = useState(300);
  const [code, setCode] = useState('print("Hello, Codelave!")\n');
  const [output, setOutput] = useState<{ type: 'stdout' | 'stderr' | 'system', text: string }[]>([]);
  
  const [sandbox, setSandbox] = useState<SandboxResponse | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    try {
      getApiKey();
      setHasApiKey(true);
    } catch {
      setHasApiKey(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (sandbox && sandbox.status === 'RUNNING') {
        // Destroy sandbox asynchronously
        destroySandbox(sandbox.id).catch(() => {});
      }
    };
  }, [sandbox]);

  const addOutput = (type: 'stdout' | 'stderr' | 'system', text: string) => {
    setOutput(prev => [...prev, { type, text }]);
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    addOutput('system', 'Starting execution...');
    
    let currentSandbox = sandbox;
    
    try {
      // 1. Create sandbox if none exists or if it's not running
      if (!currentSandbox || currentSandbox.status !== 'RUNNING') {
        setIsStarting(true);
        addOutput('system', `Creating ${template} sandbox...`);
        currentSandbox = await createSandbox(template, timeoutSecs);
        setSandbox(currentSandbox);
        setIsStarting(false);
      }
      
      // 2. Execute code
      addOutput('system', `Executing code...`);
      const startTime = Date.now();
      
      const langMap: Record<string, string> = { 'python3': 'python', 'node': 'javascript', 'ubuntu': 'bash' };
      const lang = langMap[template] || 'python';
      
      const result = await executeCode(currentSandbox.id, code, lang);
      const duration = Date.now() - startTime;
      
      if (result.output) {
        addOutput('stdout', result.output);
      }
      if (result.error) {
        addOutput('stderr', result.error);
      }
      
      addOutput('system', `Execution finished with status ${result.status} in ${duration}ms`);
      
    } catch (err: any) {
      addOutput('stderr', `Error: ${err.message || 'Failed to execute code'}`);
      setIsStarting(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTemplateChange = async (newTemplate: string) => {
    if (sandbox && sandbox.status === 'RUNNING') {
      if (!confirm('Changing template will destroy the current sandbox. Continue?')) return;
      try {
        await destroySandbox(sandbox.id);
        setSandbox(null);
      } catch (err) {
        console.error('Failed to destroy old sandbox', err);
      }
    }
    setTemplate(newTemplate);
    if (newTemplate === 'python3') setCode('print("Hello, Python!")\n');
    else if (newTemplate === 'node') setCode('console.log("Hello, Node.js!");\n');
    else setCode('echo "Hello, Ubuntu!"\n');
  };

  if (!hasApiKey) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl mb-4">No API Key Found</h2>
        <p className="mb-4 text-gray-400">You need an API key to use the playground.</p>
        <Link href="/dashboard/apikeys" className="btn-primary">Go to API Keys</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <div className="dash-header mb-4" style={{ flexShrink: 0 }}>
        <h1 className="dash-title">Playground</h1>
        <p className="dash-subtitle">Test code execution directly in your browser</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexShrink: 0, alignItems: 'center' }}>
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }}
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={isRunning || isStarting}
        >
          <option value="python3">Python 3</option>
          <option value="node">Node.js</option>
          <option value="ubuntu">Ubuntu</option>
        </select>
        
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }}
          value={timeoutSecs}
          onChange={(e) => setTimeoutSecs(Number(e.target.value))}
          disabled={isRunning || isStarting}
        >
          <option value={300}>5 min timeout</option>
          <option value={900}>15 min timeout</option>
          <option value={1800}>30 min timeout</option>
        </select>
        
        <button 
          className="btn-primary btn-sm"
          onClick={handleRun}
          disabled={isRunning || isStarting}
          style={{ padding: '0.5rem 1.5rem', fontWeight: 600 }}
        >
          {isStarting ? 'Starting...' : isRunning ? 'Running...' : 'Run Code (Cmd/Ctrl + Enter)'}
        </button>
        
        {sandbox && sandbox.status === 'RUNNING' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sandbox active ({sandbox.id.substring(0, 8)})</span>
            <button 
              className="btn-danger btn-sm" 
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
              onClick={async () => {
                await destroySandbox(sandbox.id);
                setSandbox(null);
                addOutput('system', 'Sandbox destroyed.');
              }}
            >
              Destroy
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexGrow: 1, minHeight: 0 }}>
        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0a', border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', background: 'var(--surface-bg)', borderBottom: '1px solid var(--surface-border)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Code Editor
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
              }
            }}
            style={{
              flex: 1, width: '100%', background: 'transparent', border: 'none', color: '#e5e5e5',
              padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', resize: 'none'
            }}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0a', border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'var(--surface-bg)', borderBottom: '1px solid var(--surface-border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Output</span>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
              onClick={() => setOutput([])}
            >
              Clear
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {output.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>Output will appear here...</span>
            ) : (
              output.map((out, i) => (
                <div key={i} style={{ 
                  marginBottom: '0.5rem', 
                  color: out.type === 'stderr' ? '#f87171' : out.type === 'system' ? '#60a5fa' : '#e5e5e5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {out.type === 'system' && <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>&gt;</span>}
                  {out.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
