"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { links } from "@/config/sidebarMenu";
import { cn } from "@/lib/utils";
import { LogOut, Search, Bell, Sun, Moon } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('User');
  const [open, setOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
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

  const toggleTheme = (e: React.MouseEvent) => {
    const isDark = theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ];
      
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
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
      <div className="codelave-dash-main-area relative">
        {/* Top Navbar */}
        <header className="flex items-center justify-between w-full px-6 h-16 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#070707]/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
          {/* Search - Leftmost in the navbar */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full px-4 py-2 border border-black/10 dark:border-white/10 w-64 md:w-80 transition-all focus-within:border-black/20 dark:focus-within:border-white/20 focus-within:ring-1 focus-within:ring-black/20 dark:focus-within:ring-white/20">
            <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none text-sm text-gray-800 dark:text-gray-200 outline-none w-full placeholder:text-gray-400 dark:placeholder:text-gray-500" 
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Notifications */}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative" title="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-[#070707]"></span>
            </button>

            {/* Profile (only icon, rightmost) */}
            <div className="flex items-center cursor-pointer group ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8501E] to-[#ff7e54] flex items-center justify-center text-sm font-bold text-white shadow-lg border border-black/10 dark:border-white/10 group-hover:border-black/30 dark:group-hover:border-white/30 transition-all hover:scale-105">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="codelave-dash-main-inner">
          <main className="codelave-dash-main-content">
            <div className="p-2 md:p-6 flex-1">{children}</div>
          </main>
        </div>
      </div>

      {/* ═══ Logout Modal ═══ */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsLogoutModalOpen(false)}
          />

          {/* Modal Panel */}
          <div 
            className="relative bg-white dark:bg-[#0F0F0F] border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-300"
          >
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Sign out of Codelave?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-2">
                You will need to enter your credentials again to access your environments.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
