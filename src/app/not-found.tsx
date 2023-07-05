'use client';

import { Button } from 'antd';

export default function NotFound() {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <p className="m-0 text-xl text-gray-400">ERROR</p>
      <p className="m-0 text-8xl font-bold text-gray-400">404</p>
      <p className="m-0 text-xl text-gray-400">PAGE NOT FOUND</p>
      <Button href="/" type="primary">
        Back to home.
      </Button>
      <div></div>
    </div>
  );
}
