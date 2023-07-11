import { PropsWithChildren } from 'react';

import AdminLayout from '@/components/AdminLayout';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AdminLayout>{children}</AdminLayout>;
}
