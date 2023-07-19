'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) redirect('/');
  }, [accessToken]);

  return children;
}
