import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Popconfirm,
  Tag,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import { BsChevronDown } from 'react-icons/bs';
import { BiUser, BiHistory, BiLogOut, BiSolidUser } from 'react-icons/bi';

import { useAppDispatch, useAppSelector } from '@/hooks';
import g19logo from '@/assets/g19.svg';
import ThemeToggle from './ThemeToggle';
import { logout } from '@/redux/reducers/authSlice';

export default function Navbar() {
  const { accessToken, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const logoutHandler = useCallback(() => {
    dispatch(logout());
    message.success('Berhasil keluar.');
  }, [dispatch]);

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        label: 'Layanan',
        key: 'product',
        children: [
          {
            label: <Link href="/rental">Rental Kendaraan</Link>,
            key: '/rental',
          },
          {
            label: <Link href="/tour">Trip Wisata</Link>,
            key: '/tour',
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
          <Link
            href={userInfo.role === 'admin' ? '/admin' : '/profile'}
            className="flex flex-col"
          >
            <span className="font-bold">{userInfo?.username}</span>
            <Tag
              color={userInfo?.role === 'admin' ? 'gold' : 'blue'}
              bordered={false}
              className="w-fit"
            >
              {userInfo?.role}
            </Tag>
          </Link>
        ),
        key: 'profil',
        icon: <BiUser size={16} />,
      },
      {
        type: 'divider',
      },
      {
        label: (
          <Popconfirm
            placement="topRight"
            title="Sign out"
            description="Apakah anda yakin akan keluar?"
            onConfirm={logoutHandler}
            okText="Ya"
            cancelText="Batal"
          >
            Sign Out
          </Popconfirm>
        ),
        key: 'logout',
        icon: <BiLogOut size={16} />,
        danger: true,
      },
    ],
    [userInfo, logoutHandler]
  );

  const menuProps = useMemo(
    () => ({
      items: dropDownItems,
    }),
    [dropDownItems]
  );

  return (
    <Layout.Header className="w-full bg-white dark:bg-gray-900 px-[5%] border-0 border-solid border-b border-b-gray-300 dark:border-b-gray-600">
      <div className="max-w-[1400px] mx-auto flex justify-between gap-4 items-center">
        <div className="flex gap-2 flex-1 items-center">
          <Link href="/" className="hover:animate-pulse relative">
            <Image
              src={g19logo}
              alt="G19 logo"
              priority
              height={32}
              width={75}
              className="m-0"
            />
          </Link>
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[pathname]}
            forceSubMenuRender
            className="bg-transparent"
          />
          <div className="flex-1"></div>
        </div>
        {!['/login', '/register'].includes(pathname) ? (
          <>
            {!accessToken ? (
              <Link href="/login">
                <Button icon={<BiUser />}>Login</Button>
              </Link>
            ) : (
              <Dropdown
                menu={menuProps}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button className="p-1 sm:px-3">
                  <div className="flex gap-2 items-center">
                    {userInfo.role === 'admin' ? (
                      <Avatar
                        size={22}
                        className="flex justify-center items-center bg-[#00aeef]"
                      >
                        G19
                      </Avatar>
                    ) : userInfo.image ? (
                      <Avatar src={userInfo.image} size={22} />
                    ) : (
                      <Avatar
                        icon={<BiSolidUser size={12} />}
                        size={22}
                        className="flex justify-center items-center bg-[#00aeef]"
                      />
                    )}
                    <span className="hidden sm:inline">
                      {userInfo.username}
                    </span>
                    <BsChevronDown className="text-xs text-gray-400" />
                  </div>
                </Button>
              </Dropdown>
            )}
          </>
        ) : null}
        <ThemeToggle />
      </div>
    </Layout.Header>
  );
}
