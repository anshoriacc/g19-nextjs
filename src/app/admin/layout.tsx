import { PropsWithChildren } from 'react';

import AdminLayout from '@/components/admin/AdminLayout';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AdminLayout>{children}</AdminLayout>;
}
