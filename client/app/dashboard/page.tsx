"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getUsage, type UsageSummary, listSandboxes, type SandboxResponse, getApiKey } from '@/lib/api';

export default function DashboardOverviewPage() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [activeSandboxes, setActiveSandboxes] = useState<SandboxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const usageData = await getUsage();
      setUsage(usageData);

      try {
        getApiKey(); // Test if key exists
        const sandboxes = await listSandboxes();
        setActiveSandboxes(sandboxes.filter(s => s.status === 'RUNNING'));
        setHasApiKey(true);
      } catch (e) {
        setHasApiKey(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (hasApiKey) {
        listSandboxes().then(sandboxes => {
          setActiveSandboxes(sandboxes.filter(s => s.status === 'RUNNING'));
        }).catch(() => { });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData, hasApiKey]);

  if (loading) return <div className="p-4 text-gray-400">Loading overview...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const usagePercent = usage ? (usage.computeSeconds / usage.limits.maxComputeSeconds) * 100 : 0;
  const isUsageHigh = usagePercent > 80;

  return (
    <>
      <div className="dash-header flex justify-between items-start" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 className="dash-title">Overview</h1>
          <p className="dash-subtitle">What is happening right now?</p>
        </div>
        <Link href="/dashboard/playground" className="btn-primary btn-sm">
          Open Playground
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Sandboxes Created</div>
          <div className="stat-value">
            {usage?.sandboxCount ?? 0} <span>/ {usage?.limits.maxSandboxes ?? '-'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Executions</div>
          <div className="stat-value">
            {usage?.executionCount ?? 0} <span>/ {usage?.limits.maxExecutions ?? '-'}</span>
          </div>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div className="stat-label">Compute Seconds</div>
          <div className="stat-value">
            {usage?.computeSeconds.toFixed(1) ?? '0.0'} <span>/ {usage?.limits.maxComputeSeconds ?? '-'}s</span>
          </div>
          {usage && (
            <div className="progress-bar-container">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(100, usagePercent)}%`,
                    background: isUsageHigh ? '#ef4444' : 'var(--accent-gradient)'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Active Sandboxes</h2>
        </div>

        {!hasApiKey ? (
          <div className="empty-state">
            <p>You need an API key to view and create sandboxes.</p>
            <Link href="/dashboard/apikeys" className="btn-primary btn-sm mt-2">Go to API Keys</Link>
          </div>
        ) : activeSandboxes.length === 0 ? (
          <div className="empty-state">
            <p>No sandboxes are currently running.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Template</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {activeSandboxes.map(sandbox => (
                <tr key={sandbox.id}>
                  <td style={{ fontFamily: 'monospace' }}>{sandbox.id.substring(0, 8)}...</td>
                  <td>{sandbox.template}</td>
                  <td>{new Date(sandbox.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
