/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

function CornerBrackets() {
  return (
    <>
      <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none z-10" />
      <div className="absolute top-[-1px] right-[-1px] w-1.5 h-1.5 border-t border-r border-white pointer-events-none z-10" />
      <div className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 border-b border-l border-white pointer-events-none z-10" />
      <div className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 border-b border-r border-white pointer-events-none z-10" />
    </>
  );
}

function IndicatorBars() {
  return (
    <div className="flex items-center gap-[2px]">
      <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-30" />
      <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
      <span className="inline-block w-[3px] h-[10px] bg-[#E8501E]" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);

      // Persist token & userId
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userId', data.userId);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070707] flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Side Connectors */}
      <div className="absolute inset-y-0 left-6 right-6 lg:left-8 lg:right-8 mx-auto w-full max-w-[1400px] pointer-events-none hidden md:block">
        <div className="absolute inset-y-0 left-0 w-[1px] border-l border-dashed border-white/10" />
        <div className="absolute inset-y-0 right-0 w-[1px] border-r border-dashed border-white/10" />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E8501E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[450px] border border-dashed border-white/10 bg-[#0F0F0F] p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10">
        <CornerBrackets />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <Image src="/logo.png" alt="Codelave" width={36} height={36} className="w-9 h-auto object-contain" />
            <span className="text-[20px] font-semibold text-[#F2F2F2] font-navbar">Codelave</span>
          </Link>
          
          <div className="relative inline-flex items-center gap-3 px-4 py-1.5 border border-dashed border-white/10 mb-4 mx-auto">
            <CornerBrackets />
            <IndicatorBars />
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#969696] font-navbar font-semibold">
              Secure Gateway
            </span>
          </div>

          <h1 className="text-[24px] font-bold text-[#F2F2F2] font-hero-heading tracking-tight leading-tight">
            Welcome back
          </h1>
          <p className="text-[14px] text-[#969696] font-navbar mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="relative border border-dashed border-red-500/20 bg-red-950/10 px-4 py-3 mb-6 text-sm text-red-400 font-mono flex items-start gap-2.5">
            <div className="absolute top-[-1px] left-[-1px] w-1 h-1 bg-red-500" />
            <div className="absolute top-[-1px] right-[-1px] w-1 h-1 bg-red-500" />
            <div className="absolute bottom-[-1px] left-[-1px] w-1 h-1 bg-red-500" />
            <div className="absolute bottom-[-1px] right-[-1px] w-1 h-1 bg-red-500" />
            <span className="text-red-500 mt-0.5 select-none">✕</span>
            <div>
              <div className="font-semibold uppercase tracking-wider text-[10px] text-red-500 mb-0.5">Error Detected</div>
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label htmlFor="login-email" className="block text-[11px] uppercase tracking-wider text-[#969696] font-navbar font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-[#070707] text-[#FAFAFA] border border-dashed border-white/10 hover:border-white/20 focus:border-[#E8501E]/40 focus:ring-1 focus:ring-[#E8501E]/20 focus:outline-none transition-all px-4 py-3 text-sm font-navbar"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="login-password" className="block text-[11px] uppercase tracking-wider text-[#969696] font-navbar font-semibold">
                Password
              </label>
              <Link href="#" className="text-xs text-[#71717A] hover:text-[#969696] transition-colors font-navbar">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-[#070707] text-[#FAFAFA] border border-dashed border-white/10 hover:border-white/20 focus:border-[#E8501E]/40 focus:ring-1 focus:ring-[#E8501E]/20 focus:outline-none transition-all px-4 py-3 text-sm font-navbar"
            />
          </div>

          {/* Premium Animated Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full inline-flex items-center justify-between gap-6 bg-[#E8501E] text-white font-navbar text-sm font-medium py-2.5 pr-2.5 pl-5 transition-all hover:bg-[#ff622e] border border-dashed border-[#E8501E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <CornerBrackets />
            <span className="relative overflow-hidden inline-flex">
              <span className="text-[16px] font-semibold text-transparent select-none">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
              <span className="absolute left-0 top-0 text-[16px] font-semibold text-white transition-transform duration-300 group-hover:-translate-y-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
              <span className="absolute left-0 top-0 text-[16px] font-semibold text-white transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </span>
            <div className="relative flex w-8 h-8 items-center justify-center bg-white/[0.1] border border-dashed border-white/20 shrink-0">
              <div className="absolute w-[4px] h-[4px] bg-white transition-all duration-300" />
              <div className="absolute w-[4px] h-[4px] bg-white -translate-y-[7px] group-hover:-translate-y-[4px] transition-all duration-300" />
              <div className="absolute w-[4px] h-[4px] bg-white translate-y-[7px] group-hover:translate-y-[4px] transition-all duration-300" />
              <div className="absolute w-[4px] h-[4px] bg-white -translate-x-[7px] group-hover:-translate-x-[4px] transition-all duration-300" />
              <div className="absolute w-[4px] h-[4px] bg-white translate-x-[7px] group-hover:translate-x-[4px] transition-all duration-300" />
            </div>
          </button>
        </form>

        {/* Switch to signup */}
        <div className="text-sm text-[#969696] font-navbar mt-8 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#E8501E] hover:text-[#ff622e] hover:underline font-semibold transition-all ml-1">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
