import { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import ParentLayout from '@/components/ParentLayout';
import './globals.css';
import 'antd/dist/reset.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | G19 Tour & Travel',
    default: 'G19 Tour & Travel',
  },
  description: 'G19 Tour & Travel website',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ParentLayout>{children}</ParentLayout>
      </body>
    </html>
  );
}
