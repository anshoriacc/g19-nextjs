'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { ConfigProvider, Layout } from 'antd';

import AntdProvider from './AntdProvider';
import Navbar from './Navbar';
import Footer from './Footer';

export function AntdConfigProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00aeef',
        },
      }}
    >
      <AntdProvider>{children}</AntdProvider>
    </ConfigProvider>
  );
}

export default function ParentLayout({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return;
  }

  return (
    <AntdConfigProvider>
      <Layout className="min-h-[100vh]">
        <Navbar />
        <Layout hasSider className="min-h-[calc(100vh-4rem)]">
          {children}
        </Layout>
        <Footer />
      </Layout>
    </AntdConfigProvider>
  );
}
