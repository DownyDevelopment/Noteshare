'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Wallet, ChevronDown, User, LayoutDashboard, Plus, LogOut, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { user, isAuthenticated, isAuthLoading, signOut } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    signOut();
    router.push('/');
  };

  const loginHref =
    pathname.startsWith('/login') || pathname.startsWith('/signup')
      ? '/login'
      : `/login?redirect=${encodeURIComponent(pathname)}`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-brand-secondary/20 bg-brand-light/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-brand-light shadow-md transition-all group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-brand-dark">
                  Note<span className="text-brand-primary">Share</span>
                </span>
                <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-brand-accent uppercase">
                  ITS Edition
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                pathname === '/explore'
                  ? 'bg-brand-primary text-brand-light'
                  : 'text-brand-dark hover:bg-brand-secondary/10 hover:text-brand-primary'
              }`}
            >
              <Compass className="h-4 w-4" />
              Explore Notes
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-brand-primary text-brand-light'
                    : 'text-brand-dark hover:bg-brand-secondary/10 hover:text-brand-primary'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-brand-secondary/20" />
            ) : isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-brand-secondary/35 bg-white px-3.5 py-1.5 shadow-sm text-xs font-semibold">
                  <span className="flex items-center gap-1 text-sky-600 font-bold text-[10px] tracking-wider uppercase">
                    <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                    DANA
                  </span>
                  <div className="h-3 w-px bg-gray-200"></div>
                  <span className="text-brand-dark font-medium flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-brand-primary" />
                    {formatRupiah(user.balance)}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-brand-secondary/20 bg-white p-1 pr-3 shadow-sm hover:bg-brand-secondary/5 focus:outline-none transition-all active:scale-98"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full bg-amber-100 object-cover border border-brand-secondary/20"
                    />
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-xs font-semibold text-brand-dark leading-tight">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-gray-500 leading-none">
                        NRP {user.nrp.substring(0, 4)}...
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        onClick={() => setDropdownOpen(false)}
                        className="fixed inset-0 z-10 bg-transparent"
                      ></div>
                      <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-xl border border-brand-secondary/20 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="border-b border-gray-100 px-3 py-2.5">
                          <p className="text-sm font-semibold text-brand-dark leading-tight">{user.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push('/dashboard?view=consumer');
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-brand-dark hover:bg-brand-secondary/10 transition-colors"
                          >
                            <User className="h-3.5 w-3.5 text-brand-primary" />
                            My Library (Consumer)
                          </button>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push('/dashboard?view=creator');
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-brand-dark hover:bg-brand-secondary/10 transition-colors"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5 text-brand-primary" />
                            Creator Studio
                          </button>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push('/dashboard?view=creator&action=upload');
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-brand-dark hover:bg-brand-secondary/10 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 text-brand-primary" />
                            Upload Study Note
                          </button>
                        </div>
                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={loginHref}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-secondary/10 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-t border-brand-secondary/15 md:hidden bg-white/95 py-2 justify-around">
        <Link
          href="/explore"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
            pathname === '/explore' ? 'text-brand-primary' : 'text-gray-400'
          }`}
        >
          <Compass className="h-5 w-5" />
          Explore
        </Link>
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
              pathname === '/dashboard' ? 'text-brand-primary' : 'text-gray-400'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
        ) : (
          <Link
            href={loginHref}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
              pathname === '/login' ? 'text-brand-primary' : 'text-gray-400'
            }`}
          >
            <User className="h-5 w-5" />
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
