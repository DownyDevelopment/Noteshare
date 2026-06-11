'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: Record<string, string>) => Promise<{ success: boolean; message: string }>;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === 'login';

  const [name, setName] = useState('');
  const [nrp, setNrp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin && password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    const result = await onSubmit(
      isLogin
        ? { email, password }
        : { name, nrp, email, password }
    );

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
    router.push(redirect);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-brand-light shadow-lg mb-4">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">
            {isLogin ? 'Masuk ke NoteShare' : 'Daftar NoteShare'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin
              ? 'Akses dashboard, library, dan creator studio Anda.'
              : 'Buat akun eksklusif mahasiswa ITS untuk mulai berbagi catatan.'}
          </p>
        </div>

        <div className="rounded-3xl border border-brand-secondary/25 bg-white p-6 sm:p-8 shadow-xl shadow-brand-primary/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-brand-dark mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rafi Ardian"
                    className="w-full rounded-xl border border-brand-secondary/30 bg-brand-light/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nrp" className="block text-xs font-semibold text-brand-dark mb-1.5">
                    NRP
                  </label>
                  <input
                    id="nrp"
                    type="text"
                    value={nrp}
                    onChange={(e) => setNrp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="5025231045"
                    className="w-full rounded-xl border border-brand-secondary/30 bg-brand-light/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">10 digit angka NRP mahasiswa ITS</p>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-dark mb-1.5">
                Email ITS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@mhs.its.ac.id"
                className="w-full rounded-xl border border-brand-secondary/30 bg-brand-light/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-dark mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-brand-secondary/30 bg-brand-light/50 px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-brand-dark mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full rounded-xl border border-brand-secondary/30 bg-brand-light/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  required
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-600 font-medium">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-primary-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? 'Masuk' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            {isLogin ? (
              <p>
                Belum punya akun?{' '}
                <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
                  Daftar di sini
                </Link>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <Link href="/login" className="font-semibold text-brand-primary hover:underline">
                  Masuk di sini
                </Link>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6">
          Hanya untuk mahasiswa ITS dengan email @mhs.its.ac.id
        </p>
      </div>
    </div>
  );
}
