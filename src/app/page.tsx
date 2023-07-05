'use client';

import { Divider, Layout } from 'antd';
import Hero from '@/components/Hero';
import About from '@/components/About';
import OurServices from '@/components/OurServices';

export default function page() {
  return (
    <Layout.Content className='bg-gray-200'>
      <Hero />
      <About />
      <OurServices />
    </Layout.Content>
  );
}
