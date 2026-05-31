"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { links } from "@/config/sidebarMenu";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('User');
  const [open, setOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
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
    <div
      className={cn(
        "codelave-dash-wrapper",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="codelave-sidebar-body">
          <div className="codelave-sidebar-links-container">
            <div className="codelave-sidebar-links-list">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div className="codelave-sidebar-bottom-section">
            {open ? (
              <div className="codelave-sidebar-user-expanded">
                <Link href="/dashboard/settings" className="codelave-sidebar-user-info">
                  <span className="codelave-sidebar-user-name">
                    {name}
                  </span>
                  <span className="codelave-sidebar-user-email">
                    {email}
                  </span>
                </Link>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="codelave-sidebar-logout-btn"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="codelave-sidebar-logout-btn-collapsed"
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="codelave-dash-main-area">
        <div className="codelave-dash-main-inner">
          <main className="codelave-dash-main-content">
            <div className="p-2 md:p-4 flex-1">{children}</div>
          </main>
        </div>
      </div>

      {/* ═══ Logout Modal ═══ */}
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
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
