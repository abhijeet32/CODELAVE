/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listSandboxes, destroySandbox, type SandboxResponse, getApiKey } from '@/lib/api';

type Tab = 'All' | 'Running' | 'Destroyed' | 'Timed Out';

export default function SandboxesPage() {
  const router = useRouter();
  const [sandboxes, setSandboxes] = useState<SandboxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [hasApiKey, setHasApiKey] = useState(true);

  const fetchSandboxes = async () => {
    try {
      getApiKey();
      const data = await listSandboxes();
      setSandboxes(data);
      setHasApiKey(true);
    } catch (err: any) {
      if (err.message.includes('API key found')) {
        setHasApiKey(false);
      } else {
        setError(err.message || 'Failed to load sandboxes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSandboxes();
    const interval = setInterval(() => {
      if (hasApiKey) fetchSandboxes();
    }, 10000);
    return () => clearInterval(interval);
  }, [hasApiKey]);

  const handleDestroy = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Destroy this sandbox immediately?')) return;
    try {
      await destroySandbox(id);
      await fetchSandboxes();
    } catch (err: any) {
      alert(err.message || 'Failed to destroy sandbox');
    }
  };

  const filtered = sandboxes.filter(s => {
    const status = s.status?.trim().toUpperCase();
    if (activeTab === 'All') return true;
    if (activeTab === 'Running') return status === 'RUNNING';
    if (activeTab === 'Destroyed') return status === 'DESTROYED';
    if (activeTab === 'Timed Out') return status === 'TIMED_OUT';
    return true;
  });

  if (loading) return <div className="p-4 text-gray-400">Loading sandboxes...</div>;

  return (
    <>
      <div className="dash-header">
         <h1 className="dash-title">Sandboxes</h1>
        <p className="dash-subtitle">Manage isolated code execution environments</p>
      </div>

      <div className="panel">
        {!hasApiKey ? (
          <div className="empty-state">
            <p>You need an API key to view and manage sandboxes.</p>
            <Link href="/dashboard/apikeys" className="btn-primary btn-sm mt-4">Go to API Keys</Link>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6 border-b border-gray-800 pb-2" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {(['All', 'Running', 'Destroyed', 'Timed Out'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
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

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>No sandboxes found for "{activeTab}".</p>
                <Link href="/dashboard/playground" className="btn-primary btn-sm mt-4">Open Playground</Link>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Template</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Timeout / Destroyed At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(sandbox => (
                    <tr key={sandbox.id} onClick={() => router.push(`/dashboard/sandboxes/${sandbox.id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontFamily: 'monospace' }}>{sandbox.id.substring(0, 12)}...</td>
                      <td>{sandbox.template}</td>
                      <td>
                        <span className={`badge ${sandbox.status === 'RUNNING' ? 'badge-green' : sandbox.status === 'TIMED_OUT' ? 'badge-red' : 'badge-gray'}`}>
                          {sandbox.status}
                        </span>
                      </td>
                      <td>{new Date(sandbox.createdAt).toLocaleString()}</td>
                      <td>
                        {sandbox.destroyedAt 
                          ? new Date(sandbox.destroyedAt).toLocaleString() 
                          : new Date(sandbox.timeoutAt).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {sandbox.status === 'RUNNING' && (
                          <button className="btn-danger btn-sm" onClick={(e) => handleDestroy(sandbox.id, e)}>
                            Destroy
                          </button>
                        )}
                        <span className="ml-2 text-gray-500" style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>View →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}
