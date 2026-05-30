"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, deleteAccount } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.email || '');
      } catch { /* ignore */ }
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    
    setIsUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPassSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPassError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const input = prompt('This action cannot be undone. Please type "DELETE" to confirm.');
    if (input === 'DELETE') {
      try {
        await deleteAccount();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        router.push('/login');
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Failed to delete account');
      }
    }
  };

  return (
    <>
      <div className="dash-header">
        <h1 className="dash-title">Settings</h1>
        <p className="dash-subtitle">Manage your account preferences</p>
      </div>

      <div className="panel" style={{ maxWidth: '600px' }}>
        <div className="settings-section">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Profile</h3>
          
          <div className="form-group mb-6">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              disabled 
              style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Email cannot be changed.</p>
          </div>
          
          <form onSubmit={handlePasswordChange}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', marginTop: '2rem' }}>Change Password</h4>
            
            {passError && <div className="text-red-500 mb-4" style={{ color: '#f87171', fontSize: '0.85rem' }}>{passError}</div>}
            {passSuccess && <div className="text-green-500 mb-4" style={{ color: '#4ade80', fontSize: '0.85rem' }}>{passSuccess}</div>}
            
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary mt-2" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: '600px', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="settings-section">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '0.5rem', color: '#f87171' }}>Danger Zone</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e5e5e5' }}>Delete Account</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
}
