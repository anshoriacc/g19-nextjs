'use client';

import { useAppSelector } from '@/hooks';
import { useGetReservationListQuery } from '@/redux/reducers/reservationQuery';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { Alert, TablePaginationConfig, Tag, Table, Select, Image } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { DataType } from '@/app/admin/reservation/page';

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function Reservation() {
  const { accessToken } = useAppSelector((state) => state.auth);
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
            {value}
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
              Gagal menarik data, <a onClick={refetch}>klik untuk refresh.</a>
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
  );
}
