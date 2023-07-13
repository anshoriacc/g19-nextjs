'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useTheme, ThemeProvider } from 'next-themes';
import Image from 'next/image';

import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

import { ConfigProvider, theme, Layout } from 'antd';
import AntdProvider from './AntdProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import SplashScreen from './SplashScreen';

export function AntdConfigProvider({ children }: PropsWithChildren) {
  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00aeef',
        },
        algorithm:
          currentTheme === 'dark'
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
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
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider attribute="class" enableSystem={false}>
          <AntdConfigProvider>
            <Layout className="min-h-[100vh]">
              <Navbar />
              <Layout
                hasSider
                className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-800"
              >
                {children}
              </Layout>
              <Footer />
            </Layout>
          </AntdConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
