/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword, deleteAccount } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
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
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setName(storedName);
        } else if (payload.email) {
          setName(payload.email.split('@')[0]);
        }
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
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password');
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
      } catch (err: any) {
        alert(err.message || 'Failed to delete account');
      }
    }
  };

  const handleNameSave = () => {
    localStorage.setItem('userName', name);
    window.dispatchEvent(new Event('userNameUpdated'));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 pt-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
      </div>

      {/* NAME PANEL */}
      <div className="border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0a0a0a] overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">Name</h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-4">Update your account name, which will be visible to your team members.</p>
          
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border border-black/20 dark:border-white/10 rounded px-3 py-2 text-[14px] text-gray-900 dark:text-white w-full max-w-sm focus:outline-none focus:border-black/50 dark:focus:border-white/30 transition-colors"
          />
        </div>
        <div className="px-6 py-3 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#0f0f0f] flex items-center justify-between">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Max 100 characters.</p>
          <button onClick={handleNameSave} className="px-4 py-1.5 bg-black dark:bg-[#333] hover:dark:bg-[#444] text-white text-[13px] font-medium rounded-md transition-colors">Save</button>
        </div>
      </div>

      {/* E-MAIL PANEL */}
      <div className="border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0a0a0a] overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">E-Mail</h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-4">E-mail changes are currently unavailable.</p>
          
          <input 
            type="email" 
            value={email} 
            disabled 
            className="bg-gray-50 dark:bg-[#050505] border border-black/10 dark:border-white/10 rounded px-3 py-2 text-[14px] text-gray-500 dark:text-gray-400 w-full max-w-sm cursor-not-allowed font-mono"
          />
        </div>
        <div className="px-6 py-3 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#0f0f0f] flex items-center justify-between">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Has to be a valid e-mail address.</p>
          <button disabled className="px-4 py-1.5 bg-gray-100 dark:bg-[#222] text-gray-400 dark:text-gray-500 text-[13px] font-medium rounded-md cursor-not-allowed">Save</button>
        </div>
      </div>

      {/* PASSWORD PANEL */}
      <div className="border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#0a0a0a] overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">Password</h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-4">Update your account password.</p>
          
          {passError && <div className="text-[#f87171] text-[13px] mb-4 bg-[#f87171]/10 px-3 py-2 rounded border border-[#f87171]/20 max-w-sm">{passError}</div>}
          {passSuccess && <div className="text-[#4ade80] text-[13px] mb-4 bg-[#4ade80]/10 px-3 py-2 rounded border border-[#4ade80]/20 max-w-sm">{passSuccess}</div>}
          
          <form id="password-form" onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
            <input 
              type="password" 
              placeholder="Current Password"
              required 
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="bg-transparent border border-black/20 dark:border-white/10 rounded px-3 py-2 text-[14px] text-gray-900 dark:text-white w-full focus:outline-none focus:border-black/50 dark:focus:border-white/30 transition-colors"
            />
            <input 
              type="password" 
              placeholder="New Password"
              required 
              minLength={8}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="bg-transparent border border-black/20 dark:border-white/10 rounded px-3 py-2 text-[14px] text-gray-900 dark:text-white w-full focus:outline-none focus:border-black/50 dark:focus:border-white/30 transition-colors"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password"
              required 
              minLength={8}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="bg-transparent border border-black/20 dark:border-white/10 rounded px-3 py-2 text-[14px] text-gray-900 dark:text-white w-full focus:outline-none focus:border-black/50 dark:focus:border-white/30 transition-colors"
            />
          </form>
        </div>
        <div className="px-6 py-3 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#0f0f0f] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Must be at least 8 characters long.</p>
          <button type="submit" form="password-form" disabled={isUpdating} className="px-4 py-1.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-[13px] font-medium rounded-md transition-colors disabled:opacity-50">
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* DANGER ZONE PANEL */}
      <div className="border border-red-500/20 dark:border-red-500/30 rounded-lg bg-white dark:bg-[#0a0a0a] overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-red-600 dark:text-red-500 mb-2">Delete Account</h3>
          <p className="text-[14px] text-gray-600 dark:text-gray-300 mb-4">Permanently remove your account and all of its contents from the Codelave platform. This action is not reversible, so please continue with caution.</p>
        </div>
        <div className="px-6 py-3 border-t border-red-500/10 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-[13px] text-red-600/80 dark:text-red-400/80">Proceed with extreme caution.</p>
          <button onClick={handleDeleteAccount} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium rounded-md transition-colors shadow-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
