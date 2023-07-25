'use client';

import { PropsWithChildren, useMemo, useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Layout, Menu, MenuProps, message } from 'antd';
import { RiCarFill, RiDashboardFill, RiHistoryFill } from 'react-icons/ri';
import { useAppSelector } from '@/hooks';
import { CgMenuGridO } from 'react-icons/cg';
import { PiMountainsFill } from 'react-icons/pi';
import { MdOutlineScreenshotMonitor } from 'react-icons/md';

export default function AdminLayout({ children }: PropsWithChildren) {
  const { userInfo } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  useEffect(() => {
    if (userInfo.role !== 'admin') {
      redirect('/');
    }
  }, [userInfo.role]);

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        label: <Link href="/admin">Dashboard</Link>,
        key: '/admin',
        icon: <RiDashboardFill />,
      },
      {
        label: <Link href="/admin/reservation">Reservasi</Link>,
        key: '/admin/reservation',
        icon: <RiHistoryFill />,
      },
      {
        label: 'Produk',
        key: 'product',
        icon: <CgMenuGridO />,
        children: [
          {
            label: <Link href="/admin/product/rental">Kendaraan</Link>,
            key: '/admin/product/rental',
            icon: <RiCarFill />,
          },
          {
            label: <Link href="/admin/product/tour">Trip Wisata</Link>,
            key: '/admin/product/tour',
            icon: <PiMountainsFill />,
          },
        ],
      },
      {
        label: <Link href="/admin/banner">Banner</Link>,
        key: '/admin/banner',
        icon: <MdOutlineScreenshotMonitor />,
      },
    ],
    []
  );

  return (
    <>
      <Layout.Sider
        breakpoint="md"
        collapsedWidth={0}
        style={{ background: '#111827' }}
      >
        <Menu
          theme="dark"
          className="bg-transparent"
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={['/admin']}
          selectedKeys={[pathname]}
          defaultOpenKeys={['product']}
        />
      </Layout.Sider>
      <Layout.Content className="p-4">{children}</Layout.Content>
    </>
  );
}
