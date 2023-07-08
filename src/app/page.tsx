'use client';

import { Layout } from 'antd';
import Hero from '@/components/Hero';
import About from '@/components/About';
import OurServices from '@/components/OurServices';

export default function Home() {
  return (
    <Layout.Content className="bg-gray-200 flex flex-col">
      <Hero />
      <About />
      <OurServices />
    </Layout.Content>
  );
}
