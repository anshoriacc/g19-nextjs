'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDeleteProductMutation } from '@/redux/reducers/productQuery';
import clsx from 'clsx';
import {
  Alert,
  Button,
  Image,
  Input,
  Popconfirm,
  Select,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import useDebounce from '@/hooks/useDebounce';

import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoAdd } from 'react-icons/io5';
import AddVehicle from '@/components/admin/AddVehicle';
import { useAppSelector } from '@/hooks';
import UpdateVehicle from '@/components/admin/UpdateVehicle';
import { useGetReservationListQuery } from '@/redux/reducers/reservationQuery';
import dayjs from 'dayjs';
import delimiterFormatter from '@/utils/delimiterFormatter';
import ActionReservation from '@/components/admin/ActionReservation';

export interface DataType {
  number: number;
  id: string;
  type: 'rental' | 'tour' | 'carter' | undefined;
  startDate: Date;
  endDate: Date;
  addOn: 'driver' | undefined;
  total: number;
  payment: 'cash' | 'cashless';
  paymentId: string;
  user: any;
  vehicle?: any;
  tour?: any;
  status:
    | 'pending'
    | 'paid'
    | 'confirmed'
    | 'on going'
    | 'finished'
    | 'cancelled';
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function ReservationAdmin() {
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
      sortBy: queryParams.sortBy,
    },
    { refetchOnFocus: true }
  );

  const changeParamsHandler = useCallback((params: string, value: any) => {
    setQueryParams((prev) => ({ ...prev, [params]: value }));
  }, []);

  useEffect(() => {
    setParams({
      pagination: { ...params.pagination, total: data?.meta?.totalData },
    });
  }, [data?.meta?.totalData]);

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
        title: 'Aksi',
        render: (value, record) => (
          <ActionReservation id={record.id} status={record.status} />
        ),
      },
    ],
    [params.pagination]
  );

  const tableData = useMemo<DataType[]>(
    () => (data?.data ? data.data : []),
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
    <section className="min-h-full p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold">Reservasi</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          placeholder="filter by type"
          onChange={(value) => changeParamsHandler('type', value)}
          options={[
            { value: 'rental', label: 'Rental' },
            { value: 'tour', label: 'Trip' },
          ]}
          size="large"
          className="w-fit"
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
              label: 'Konfirmasi',
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
              label: 'Batalkan',
            },
          ]}
          size="large"
          className="w-fit"
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
          className="w-fit"
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
    </section>
  );
}
