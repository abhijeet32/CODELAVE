"use client";

import { useEffect, useState } from 'react';
import { getUsage, type UsageSummary } from '@/lib/api';

export default function BillingPage() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsage()
      .then(setUsage)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-gray-400">Loading usage data...</div>;

  const sandboxPercent = usage ? (usage.sandboxCount / usage.limits.maxSandboxes) * 100 : 0;
  const executionPercent = usage ? (usage.executionCount / usage.limits.maxExecutions) * 100 : 0;
  const computePercent = usage ? (usage.computeSeconds / usage.limits.maxComputeSeconds) * 100 : 0;

  return (
    <>
      <div className="dash-header flex justify-between items-start" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dash-title">Usage & Billing</h1>
          <p className="dash-subtitle">Understand consumption and plan limits</p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>Free Plan</span>
      </div>

      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-label">Sandboxes Created</div>
          <div className="stat-value">
            {usage?.sandboxCount ?? 0} <span>/ {usage?.limits.maxSandboxes ?? 5}</span>
          </div>
          {usage && (
            <div className="progress-bar-container">
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, sandboxPercent)}%`,
                    background: sandboxPercent > 80 ? '#ef4444' : 'var(--accent-gradient)'
                  }} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-label">Executions</div>
          <div className="stat-value">
            {usage?.executionCount ?? 0} <span>/ {usage?.limits.maxExecutions ?? 100}</span>
          </div>
          {usage && (
            <div className="progress-bar-container">
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, executionPercent)}%`,
                    background: executionPercent > 80 ? '#ef4444' : 'var(--accent-gradient)'
                  }} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-label">Compute Seconds</div>
          <div className="stat-value">
            {usage?.computeSeconds.toFixed(1) ?? '0.0'} <span>/ {usage?.limits.maxComputeSeconds ?? 600}s</span>
          </div>
          {usage && (
            <div className="progress-bar-container">
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, computePercent)}%`,
                    background: computePercent > 80 ? '#ef4444' : 'var(--accent-gradient)'
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Plan Comparison</h2>
        </div>
        
        <table className="data-table" style={{ border: '1px solid var(--surface-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th>Feature</th>
              <th>Free (Current)</th>
              <th>Pro</th>
              <th>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 500 }}>Sandboxes / month</td>
              <td>5</td>
              <td>1,000</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Executions / month</td>
              <td>100</td>
              <td>10,000</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Compute Seconds</td>
              <td>600s</td>
              <td>100,000s</td>
              <td>Custom</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Max Sandbox Timeout</td>
              <td>30 mins</td>
              <td>2 hours</td>
              <td>24 hours</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Price</td>
              <td>$0/mo</td>
              <td>$49/mo</td>
              <td>Contact Us</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex justify-center" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Upgrade to Pro</button>
        </div>
      </div>
    </>
  );
}
