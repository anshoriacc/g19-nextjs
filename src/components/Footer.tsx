import Image from 'next/image';
import Link from 'next/link';
import { Divider, Layout } from 'antd';
import g19logo from '@/assets/g19.svg';
import { MdOutlineEmail, MdPhone } from 'react-icons/md';

export default function Footer() {
  return (
    <Layout.Footer className="bg-gray-900 text-white border-t border-t-gray-300 dark:border-t-gray-600">
      <div className="flex flex-col gap-4 items-center">
        <Link href="/" className="h-8 hover:animate-pulse">
          <Image src={g19logo} alt="G19 logo" priority height={32} />
        </Link>
        <div className="flex gap-4">
          <Link href="/rental">RENTAL KENDARAAN</Link>|
          <Link href="/tour">TRIP WISATA</Link>
        </div>
      </div>
      <div className="mx-auto max-w-[400px]">
        <Divider className="bg-gray-600" />
      </div>
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-center">
            Jl. Margo Basuki Mulyoagung Kec. Dau Kab, Malang
          </p>
          <p className="text-center">
            <Link
              href="mailto:g19tourtravel@gmail.com"
              className="flex gap-1 items-center"
            >
              <MdOutlineEmail /> g19tourtravel@gmail.com
            </Link>
          </p>
          <p className="text-center">
            <Link href="tel:+6281234567890" className="flex gap-1 items-center">
              <MdPhone /> +62 812 3456 7890
            </Link>
          </p>
        </div>
        <p className="text-gray-400">© 2023 G19 Tour & Travel</p>
      </div>
    </Layout.Footer>
  );
}
