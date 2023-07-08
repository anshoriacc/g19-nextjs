import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, Button, Dropdown, Layout, Menu, Tag } from 'antd';
import type { MenuProps } from 'antd';
import g19logo from '@/assets/g19.svg';
import { BsChevronDown } from 'react-icons/bs';
import { BiSolidUser, BiUser, BiHistory, BiLogOut } from 'react-icons/bi';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = useMemo<MenuProps['items']>(
    () => [
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
    ],
    []
  );

  const dropDownItems = useMemo<MenuProps['items']>(
    () => [
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
        icon: <BiUser size={16} />,
      },
      {
        label: <Link href="/history">Riwayat</Link>,
        key: 'history',
        icon: <BiHistory size={16} />,
      },
      {
        type: 'divider',
      },
      {
        label: 'Sign Out',
        key: 'logout',
        icon: <BiLogOut size={16} />,
        danger: true,
      },
    ],
    []
  );

  const menuProps = useMemo(
    () => ({
      items: dropDownItems,
    }),
    [dropDownItems]
  );

  return (
    <Layout.Header className="w-full bg-white dark:bg-gray-900 px-[5%]">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-2 flex-1 items-center">
          <Link href="/" className="h-8 w-[75px] hover:animate-pulse">
            <Image
              src={g19logo}
              alt="G19 logo"
              priority
              height={32}
              width={75}
            />
          </Link>
          <Menu
            mode="horizontal"
            items={menuItems}
            forceSubMenuRender
            className="bg-transparent"
          />
          <div className="flex-1"></div>
        </div>
        {!['/login', '/register'].includes(pathname) ? (
          <>
            <Link href="/login">
              <Button icon={<BiUser />}>Login</Button>
            </Link>
            <Dropdown
              menu={menuProps}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button>
                <div className="flex gap-2 items-center">
                  <Avatar
                    icon={<BiSolidUser size={12} />}
                    size={22}
                    className="flex justify-center items-center"
                  />
                  <span className="hidden sm:inline">Administrator</span>
                  <BsChevronDown className="text-xs text-gray-400" />
                </div>
              </Button>
            </Dropdown>
          </>
        ) : null}
        <ThemeToggle />
      </div>
    </Layout.Header>
  );
}
