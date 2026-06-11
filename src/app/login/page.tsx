'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const { signIn, isAuthenticated, isAuthLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || isAuthenticated) {
    return null;
  }

  return (
    <AuthForm
      mode="login"
      onSubmit={async (data) => signIn({ email: data.email, password: data.password })}
    />
  );
}
