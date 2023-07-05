import { Avatar, Button, Dropdown, Layout, Menu, Tag } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import type { MenuProps } from 'antd';
import {
  DownOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import g19logo from '@/assets/g19.svg';

export default function Navbar() {
  const items: MenuProps['items'] = [
    {
      label: 'Layanan',
      key: 'layanan',
      children: [
        {
          label: <Link href="/rental">Rental Mobil</Link>,
          key: 'rental',
        },
        {
          label: <Link href="/tour">Trip Wisata</Link>,
          key: 'tour',
        },
      ],
    },
  ];

  const dropDownItems: MenuProps['items'] = [
    {
      label: (
        <Link href="/profile" className="flex flex-col">
          <span className="font-bold">Administrator</span>
          <Tag color="gold" bordered={false} className="w-fit">
            admin
          </Tag>
        </Link>
      ),
      key: 'profil',
      icon: <UserOutlined />,
    },
    {
      label: <Link href="/history">Riwayat</Link>,
      key: 'history',
      icon: <HistoryOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Sign Out',
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items: dropDownItems,
  };

  return (
    <Layout.Header className="w-full bg-white px-[5%] sm:px-[10%]">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-2 flex-1 items-center">
          <Link href="/" className="h-8 w-[75px] hover:animate-pulse">
            <Image src={g19logo} alt="G19 logo" height={32} width={75} />
          </Link>
          <Menu mode="horizontal" items={items} forceSubMenuRender />
          <div className="flex-1"></div>
        </div>
        <Button href="/login" icon={<UserOutlined />}>
          Login
        </Button>
        <Dropdown menu={menuProps} trigger={['click']} placement="bottomRight">
          <Button>
            <div className="flex gap-2 items-center">
              <Avatar icon={<UserOutlined />} size={22} />
              <span className="hidden sm:inline">Administrator</span>
              <DownOutlined className="text-xs text-gray-400" />
            </div>
          </Button>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}
