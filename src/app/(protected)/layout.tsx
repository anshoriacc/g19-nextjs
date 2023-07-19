import { PropsWithChildren } from 'react';

import ProtectedLayout from '@/components/ProtectedLayout';

export default function Layout({ children }: PropsWithChildren) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
