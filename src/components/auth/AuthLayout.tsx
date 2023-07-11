'use client';

import { PropsWithChildren, useEffect } from 'react';
import { Layout } from 'antd';

import { useAppSelector } from '@/hooks';

import AuthCarousel from './AuthCarousel';
import { redirect, usePathname } from 'next/navigation';

export default function AuthLayout({ children }: PropsWithChildren) {
  const { accessToken } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  useEffect(() => {
    if (accessToken) redirect('/');
  }, [accessToken]);

  return (
    <Layout.Content className="relative">
      <section className="absolute flex flex-col items-center z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-4xl font-bold text-[#00aeef] self-start m-0">
          {pathname === '/login' ? 'Masuk.' : 'Daftar.'}
        </h1>
        <p className="hidden sm:inline text-xl text-white self-start mb-4">
          Dan mulai perjalanan anda dengan kami.
        </p>
        {children}
      </section>
      <AuthCarousel />
    </Layout.Content>
  );
}
