import { PropsWithChildren } from 'react';

import AdminLayout from '@/components/admin/AdminLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s – Admin',
    default: 'Admin',
  },
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AdminLayout>{children}</AdminLayout>;
}
