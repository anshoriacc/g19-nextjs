'use client';

import { Layout } from 'antd';
import Hero from '@/components/Home/Hero';
import About from '@/components/Home/About';
import OurServices from '@/components/Home/OurServices';

export default function Home() {
  return (
    <Layout.Content className="flex flex-col">
      <Hero />
      <About />
      <OurServices />
    </Layout.Content>
  );
}
