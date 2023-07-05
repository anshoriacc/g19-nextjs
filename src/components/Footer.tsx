import Image from 'next/image';
import Link from 'next/link';
import { Divider, Layout } from 'antd';
import g19logo from '@/assets/g19.svg';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <Layout.Footer className="bg-gray-800 text-white">
      <div className="flex flex-col gap-4 items-center">
        <Link href="/" className="h-8 hover:animate-pulse">
          <Image src={g19logo} alt="G19 logo" height={32} />
        </Link>
        <div className="flex gap-4">
          <Link href="/rental">RENTAL MOBIL</Link>|
          <Link href="/tour">TRIP WISATA</Link>
        </div>
      </div>
      <Divider className="bg-gray-600" />
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-2 items-center">
          <p className="m-0 text-center">
            Jl. Margo Basuki Mulyoagung Kec. Dau Kab, Malang
          </p>
          <p className="m-0 text-center">
            <a href="mailto:g19tourtravel@gmail.com">
              <MailOutlined /> g19tourtravel@gmail.com
            </a>
          </p>
          <p className="m-0 text-center">
            <a href="tel:+6281234567890">
              <PhoneOutlined /> +62 812 3456 7890
            </a>
          </p>
        </div>
        <p className="m-0 text-gray-400">© 2023 G19 Tour & Travel</p>
      </div>
    </Layout.Footer>
  );
}
