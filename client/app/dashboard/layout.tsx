"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('User');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(payload.email || 'No Email');
      // Set name from email prefix or a stored name if available
      setName(payload.email ? payload.email.split('@')[0] : 'User');
    } catch { /* ignore */ }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      {/* ═══ Sidebar ═══ */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ border: '1px solid #00ffb2', background: '#00ffb2', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.02em' }}>Codelave</span>
          </Link>
          <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} title="Toggle Sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Platform</div>

          <Link href="/dashboard" className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="icon">📊</span> <span className="sidebar-link-text">Overview</span>
          </Link>
          <Link href="/dashboard/apikeys" className={`sidebar-link ${pathname === '/dashboard/apikeys' ? 'active' : ''}`}>
            <span className="icon">🔑</span> <span className="sidebar-link-text">API Keys</span>
          </Link>
          <Link href="/dashboard/sandboxes" className={`sidebar-link ${pathname.startsWith('/dashboard/sandboxes') ? 'active' : ''}`}>
            <span className="icon">📦</span> <span className="sidebar-link-text">Sandboxes</span>
          </Link>
          <Link href="/dashboard/playground" className={`sidebar-link ${pathname === '/dashboard/playground' ? 'active' : ''}`}>
            <span className="icon">⚡</span> <span className="sidebar-link-text">Playground</span>
          </Link>
          <Link href="/dashboard/sdk" className={`sidebar-link ${pathname === '/dashboard/sdk' ? 'active' : ''}`}>
            <span className="icon">📖</span> <span className="sidebar-link-text">SDK Integration</span>
          </Link>
          <Link href="/dashboard/billing" className={`sidebar-link ${pathname === '/dashboard/billing' ? 'active' : ''}`}>
            <span className="icon">💳</span> <span className="sidebar-link-text">Usage & Billing</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label" style={{ padding: '0 0.75rem 0.5rem', marginTop: '1rem' }}>Account</div>
          <Link href="/dashboard/settings" className={`sidebar-link ${pathname === '/dashboard/settings' ? 'active' : ''}`} style={{ marginBottom: '0.5rem' }}>
            <span className="icon">⚙️</span> <span className="sidebar-link-text">Settings</span>
          </Link>
          
          {/* Bugtrace Style User / Logout Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', padding: '0.5rem 0.75rem', overflow: 'hidden' }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingRight: '0.5rem', width: '100%' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email}
                </span>
              </div>
            )}
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              style={{ padding: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
              title="Sign out"
              onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
            >
              <svg width={isCollapsed ? "20" : "18"} height={isCollapsed ? "20" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <main className="dash-main">
        {children}
      </main>

      {/* ═══ Bugtrace Style Logout Modal ═══ */}
      {isLogoutModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Backdrop */}
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', animation: 'fadeIn 0.2s ease-out' }} 
            onClick={() => setIsLogoutModalOpen(false)}
          />
          
          {/* Modal Panel */}
          <div style={{ 
            position: 'relative', background: '#13121a', border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '2rem 1.5rem 1.5rem', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            textAlign: 'left', animation: 'slideUpModal 0.3s ease-out'
          }}>
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
                Logout
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.6, padding: '0 1rem', margin: 0 }}>
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 600, borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{ flex: 1, padding: '0.75rem 1rem', background: '#ef4444', border: 'none', color: '#ffffff', fontWeight: 600, borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUpModal {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />
        </div>
      )}
    </div>
  );
}

