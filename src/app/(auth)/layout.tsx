import { PropsWithChildren } from 'react';

import AuthLayout from '@/components/auth/AuthLayout';

export default function Layout({ children }: PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}
