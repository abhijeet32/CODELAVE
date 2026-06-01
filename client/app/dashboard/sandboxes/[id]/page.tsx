/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSandbox, listExecutions, listFiles, type SandboxResponse, type ExecutionResponse, type FileResponse } from '@/lib/api';

type Tab = 'Executions' | 'Files';

export default function SandboxDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [sandbox, setSandbox] = useState<SandboxResponse | null>(null);
  const [executions, setExecutions] = useState<ExecutionResponse[]>([]);
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Executions');
  const [expandedExec, setExpandedExec] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sbx, execs, fls] = await Promise.all([
          getSandbox(id),
          listExecutions(id),
          listFiles(id),
        ]);
        setSandbox(sbx);
        setExecutions(execs);
        setFiles(fls);
      } catch (err: any) {
        setError(err.message || 'Failed to load sandbox details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-400">Loading sandbox details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!sandbox) return <div className="p-4">Sandbox not found.</div>;

  return (
    <>
      <div className="dash-header mb-6">
        <Link href="/dashboard/sandboxes" className="text-blue-400 text-sm mb-2 inline-block hover:underline" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'inline-block' }}>
          ← Back to Sandboxes
        </Link>
        <h1 className="dash-title" style={{ fontFamily: 'monospace', fontSize: '1.5rem' }}>{sandbox.id}</h1>
        <p className="dash-subtitle">Sandbox Details</p>
      </div>

      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="mt-2">
            <span className={`badge ${sandbox.status === 'RUNNING' ? 'badge-green' : sandbox.status === 'TIMED_OUT' ? 'badge-red' : 'badge-gray'}`}>
              {sandbox.status}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Template</div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>{sandbox.template}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Created At</div>
          <div className="stat-value" style={{ fontSize: '1rem' }}>{new Date(sandbox.createdAt).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Destroyed / Timeout</div>
          <div className="stat-value" style={{ fontSize: '1rem' }}>
            {sandbox.destroyedAt 
              ? new Date(sandbox.destroyedAt).toLocaleString() 
              : new Date(sandbox.timeoutAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-2" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {(['Executions', 'Files'] as Tab[]).map(tab => (
            <button
              key={tab}
              className={`px-3 py-1 text-sm font-medium transition-colors`}
              style={{
                background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : '2px solid transparent', borderRadius: 0, cursor: 'pointer', fontSize: '0.9rem',
                color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? 600 : 400
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Executions' && (
          <div>
            {executions.length === 0 ? (
              <div className="empty-state">No executions found for this sandbox.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {executions.map((exec, idx) => (
                  <div key={exec.id} style={{ border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div 
                      style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}
                      onClick={() => setExpandedExec(expandedExec === exec.id ? null : exec.id)}
                    >
                      <div>
                        <span style={{ fontWeight: 600, marginRight: '1rem' }}>#{executions.length - idx}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {exec.code.substring(0, 50).replace(/\n/g, ' ')}{exec.code.length > 50 ? '...' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exec.durationMs ? `${exec.durationMs}ms` : '-'}</span>
                        <span className={`badge ${exec.status === 'COMPLETED' ? 'badge-green' : exec.status === 'FAILED' ? 'badge-red' : 'badge-yellow'}`}>
                          {exec.status}
                        </span>
                        <span style={{ fontSize: '0.8rem' }}>{expandedExec === exec.id ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expandedExec === exec.id && (
                      <div style={{ padding: '1rem', borderTop: '1px solid var(--surface-border)', background: '#0a0a0a' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Code</h4>
                        <pre style={{ background: '#111', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
                          {exec.code}
                        </pre>
                        
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Output</h4>
                        <pre style={{ background: '#111', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', color: exec.status === 'FAILED' ? '#f87171' : '#e5e5e5' }}>
                          {exec.error || exec.output || 'No output'}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Files' && (
          <div>
            {files.length === 0 ? (
              <div className="empty-state">No files uploaded to this sandbox.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size (Bytes)</th>
                    <th>Uploaded At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(f => (
                    <tr key={f.name}>
                      <td style={{ fontFamily: 'monospace' }}>{f.name}</td>
                      <td>{f.size}</td>
                      <td>{new Date(f.uploadedAt).toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-secondary btn-sm" onClick={() => {
                          // Simple window.open might not work nicely with auth, so we just alert for now or implement direct fetch
                          alert('File downloads would be implemented via direct token streaming here.');
                        }}>Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}
