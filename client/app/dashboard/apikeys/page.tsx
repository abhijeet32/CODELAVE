"use client";

import { useEffect, useState } from 'react';
import { listApiKeys, createApiKey, revokeApiKey, type ApiKeyResponse, type CreatedApiKeyResponse } from '@/lib/api';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<CreatedApiKeyResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchKeys = async () => {
    try {
      const data = await listApiKeys();
      setKeys(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    setError('');
    try {
      const result = await createApiKey(newKeyName.trim());
      setCreatedKey(result);
      
      // Auto-save the first created key as playground key if none exists
      if (!localStorage.getItem('playgroundApiKey')) {
        localStorage.setItem('playgroundApiKey', result.key);
      }
      
      await fetchKeys();
    } catch (err: any) {
      setError(err.message || 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke "${name}"? This cannot be undone.`)) return;
    try {
      await revokeApiKey(id);
      await fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke API key');
    }
  };

  if (loading) return <div className="p-4 text-gray-400">Loading API keys...</div>;

  return (
    <>
      <div className="dash-header">
        <h1 className="dash-title">API Keys</h1>
        <p className="dash-subtitle">Manage credentials for the Codelave SDK</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Your Keys</h2>
          <button className="btn-primary btn-sm" onClick={() => { setShowModal(true); setCreatedKey(null); setNewKeyName(''); }}>
            + Create New Key
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {keys.length === 0 ? (
          <div className="empty-state">
            <p>You haven&apos;t created any API keys yet.</p>
            <button className="btn-primary btn-sm mt-4" onClick={() => setShowModal(true)}>Create Your First Key</button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Used</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {keys.map(key => (
                <tr key={key.id}>
                  <td style={{ fontWeight: 500 }}>{key.name}</td>
                  <td>
                    <span className={`badge ${key.isActive ? 'badge-green' : 'badge-gray'}`}>
                      {key.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td>{new Date(key.createdAt).toLocaleDateString()}</td>
                  <td>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never used'}</td>
                  <td style={{ textAlign: 'right' }}>
                    {key.isActive && (
                      <button className="btn-danger btn-sm" onClick={() => handleRevoke(key.id, key.name)}>Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => !createdKey && setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            {!createdKey ? (
              <>
                <h2 className="modal-title">Create API Key</h2>
                <div className="form-group mt-4">
                  <label className="form-label">Key Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Production SDK"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary btn-sm" onClick={() => setShowModal(false)} disabled={isCreating}>Cancel</button>
                  <button className="btn-primary btn-sm" onClick={handleCreate} disabled={isCreating || !newKeyName.trim()}>
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">Key Created Successfully</h2>
                <p className="modal-subtitle mt-2" style={{ color: '#fbbf24' }}>
                  This key will never be shown again. Copy it now.
                </p>
                <div className="key-display mt-4">
                  {createdKey.key}
                </div>
                <div className="modal-actions mt-6">
                  <button className="btn-primary btn-sm" onClick={() => setShowModal(false)}>Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
