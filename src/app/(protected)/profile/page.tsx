'use client';

import { useAppSelector } from '@/hooks';
import { useGetReservationListQuery } from '@/redux/reducers/reservationQuery';
import delimiterFormatter from '@/utils/delimiterFormatter';
import {
  Alert,
  TablePaginationConfig,
  Tag,
  Table,
  Select,
  Image,
  Avatar,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { DataType } from '@/app/admin/reservation/page';
import { BiSolidUser } from 'react-icons/bi';

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function Profile() {
  const { accessToken, userInfo } = useAppSelector((state) => state.auth);
  const [queryParams, setQueryParams] = useState({
    type: null,
    status: null,
    sortBy: 'newest',
  });

  const [params, setParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data, isFetching, error, refetch } = useGetReservationListQuery(
    {
      accessToken,
      limit: params.pagination.pageSize,
      page: params.pagination.current,
      type: queryParams.type,
      status: queryParams.status,
      sortBy: queryParams.sortBy ?? 'newest',
    },
    { refetchOnFocus: true }
  );

  const changeParamsHandler = useCallback((params: string, value: any) => {
    setQueryParams((prev) => ({ ...prev, [params]: value }));
  }, []);

  const columns = useMemo<ColumnsType<DataType>>(
    () => [
      {
        title: '#',
        dataIndex: 'number',
        render: (value) =>
          (params.pagination.current - 1) * params.pagination.pageSize + value,
      },
      {
        title: 'Tipe',
        dataIndex: 'type',
        render: (value) =>
          value === 'rental' ? (
            <Tag color="#0073ce">RENTAL</Tag>
          ) : (
            <Tag color="#008080">TRIP</Tag>
          ),
      },
      {
        title: 'Produk',
        dataIndex: 'product',
        render: (value, record) => (
          <Link
            href={`/${record.type}/${
              record.type === 'rental' ? record.vehicleId : record.tourId
            }`}
          >
            <div className="flex gap-2 items-center">
              <Image
                src={record.image}
                alt={value}
                height={32}
                width={48}
                className="object-cover"
                fallback="data:image/png;base64,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"
              />

              {value}
            </div>
          </Link>
        ),
      },
      {
        title: 'Tanggal Mulai',
        dataIndex: 'startDate',
        render: (value) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tanggal Selesai',
        dataIndex: 'endDate',
        render: (value) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tambahan',
        dataIndex: 'addOn',
        render: (value) => value ?? '-',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        render: (value) => `Rp ${delimiterFormatter(value)}`,
      },
      {
        title: 'Pembayaran',
        dataIndex: 'payment',
        render: (value) => (value === 'case' ? 'Tunai' : 'Non Tunai'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (value) =>
          value === 'cancelled' ? (
            <Tag color="error">Dibatalkan</Tag>
          ) : value === 'paid' ? (
            <Tag color="processing">Terbayar</Tag>
          ) : value === 'pending' ? (
            <Tag color="warning">Pending</Tag>
          ) : value === 'confirmed' ? (
            <Tag color="success">Terkonfirmasi</Tag>
          ) : value === 'finished' ? (
            <Tag color="default">Selesai</Tag>
          ) : (
            <Tag color="default" className="capitalize">
              {value}
            </Tag>
          ),
      },
      {
        title: 'Tanggal Reservasi',
        dataIndex: 'createdAt',
        render: (value) => dayjs(value).format('DD MMM YYYY HH:mm:ss'),
      },
      {
        title: 'Tanggal Diperbarui',
        dataIndex: 'updatedAt',
        render: (value) => dayjs(value).format('DD MMM YYYY HH:mm:ss'),
      },
    ],
    [params.pagination]
  );

  const tableData = useMemo<DataType[]>(
    () =>
      data?.data
        ? data.data.map((data) => ({
            ...data,
            product:
              data?.type === 'rental' ? data?.vehicle?.name : data?.tour?.name,
            image:
              data?.type === 'rental'
                ? data?.vehicle?.imageUrl
                : data?.tour?.imageUrl,
          }))
        : [],
    [data?.data]
  );

  const tableChangeHandler = useCallback(
    (pagination: TablePaginationConfig) => {
      setParams({
        pagination,
      });
    },
    []
  );

  return (
    <section className="w-full px-[5%] sm:px-[10%] py-6 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start gap-4 text-center sm:text-left">
          {userInfo.role === 'admin' ? (
            <Avatar
              size={100}
              className="flex justify-center items-center bg-[#00aeef]"
            >
              G19
            </Avatar>
          ) : userInfo.image ? (
            <Avatar src={userInfo.image} size={100} />
          ) : (
            <Avatar
              icon={<BiSolidUser size={80} />}
              size={100}
              className="flex justify-center items-center bg-[#00aeef]"
            />
          )}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex gap-2 items-center">
              <h1 className="text-3xl font-bold m-0">{userInfo.name}</h1>
              <Tag
                color={userInfo?.role === 'admin' ? 'gold' : 'blue'}
                bordered={false}
                className="w-fit"
              >
                {userInfo?.role}
              </Tag>
            </div>
            <h3 className="text-xl italic m-0">{userInfo.username}</h3>
            <p className="text-md">{userInfo.phone}</p>
            <p className="text-md">{userInfo.address}</p>
          </div>
        </div>
        {userInfo?.role !== 'admin' && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Riwayat Reservasi</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <Select
                placeholder="filter by type"
                onChange={(value) => changeParamsHandler('type', value)}
                options={[
                  { value: 'rental', label: 'Rental' },
                  { value: 'tour', label: 'Trip' },
                ]}
                size="large"
                className="w-[150px]"
                allowClear
              />
              <Select
                placeholder="filter by status"
                onChange={(value) => changeParamsHandler('status', value)}
                options={[
                  {
                    value: 'pending',
                    label: 'Pending',
                  },
                  {
                    value: 'paid',
                    label: 'Terbayar',
                  },
                  {
                    value: 'confirmed',
                    label: 'Terkonfirmasi',
                  },
                  {
                    value: 'on going',
                    label: 'On going',
                  },
                  {
                    value: 'finished',
                    label: 'Selesai',
                  },
                  {
                    value: 'cancelled',
                    label: 'Dibatalkan',
                  },
                ]}
                size="large"
                className="w-[150px]"
                allowClear
              />
              <Select
                placeholder="urutkan"
                onChange={(value) => changeParamsHandler('sortBy', value)}
                options={[
                  { value: 'newest', label: 'Paling baru' },
                  { value: 'oldest', label: 'Paling lama' },
                ]}
                size="large"
                className="w-[150px]"
                allowClear
              />
            </div>
            {error && !isFetching && (
              <Alert
                message={
                  <>
                    Gagal menarik data,{' '}
                    <a onClick={refetch}>klik untuk refresh.</a>
                  </>
                }
                type="error"
                className="mb-4"
                showIcon
                closable
              />
            )}
            <Table
              columns={columns}
              rowKey={'id'}
              dataSource={tableData}
              pagination={params.pagination}
              loading={isFetching}
              onChange={tableChangeHandler}
              scroll={{ x: true }}
            />
          </div>
        )}
      </main>
    </section>
  );
}
