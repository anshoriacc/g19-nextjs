'use client';

import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 flex flex-col gap-2 justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle="Halaman yang anda akses tidak ditemukan."
        extra={
          <Button href="/" type="primary" className="bg-[#00aeef]">
            Kembali ke Beranda
          </Button>
        }
      />
    </div>
  );
}
