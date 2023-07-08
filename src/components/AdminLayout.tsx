'use client';

import React, { PropsWithChildren } from 'react';
import { Layout } from 'antd';

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Layout.Sider breakpoint="md" collapsedWidth="0">
        sider
      </Layout.Sider>
      {children}
    </>
  );
}
