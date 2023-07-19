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
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function ReservationAdmin() {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [params, setParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [openModal, setOpenModal] = useState({
    detail: false,
    add: false,
    update: false,
  });

  const toggleModal = useCallback((type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const [selectedData, setSelectedData] = useState<DataType>(null);

  const { data, isFetching, error, refetch } = useGetReservationListQuery(
    {
      accessToken,
      limit: params.pagination.pageSize,
      page: params.pagination.current,
      sortBy: 'newest',
    },
    { refetchOnFocus: true }
  );

  useEffect(() => {
    setParams({
      pagination: { ...params.pagination, total: data?.meta?.totalData },
    });
  }, [data]);

  const columns = useMemo<ColumnsType<DataType>>(
    () => [
      {
        title: '#',
        dataIndex: 'number',
        render: (value, record, index) =>
          (params.pagination.current - 1) * params.pagination.pageSize + value,
      },
      {
        title: 'Tipe',
        dataIndex: 'type',
      },
      {
        title: 'Tanggal Mulai',
        dataIndex: 'startDate',
        render: (value, record, index) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tanggal Selesai',
        dataIndex: 'endDate',
        render: (value, record, index) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tambahan',
        dataIndex: 'addOn',
      },
      {
        title: 'Total',
        dataIndex: 'total',
      },
      {
        title: 'Pembayaran',
        dataIndex: 'payment',
      },
      {
        title: 'Status',
        dataIndex: 'status',
      },
      {
        title: 'Aksi',
        dataIndex: 'action',
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

  const clearSelectedData = useCallback(() => {
    setSelectedData(null);
  }, []);

  return (
    <section className="min-h-full p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold">Reservasi</h1>
      {error && !isFetching && (
        <Alert
          message={
            <>
              Gagal menarik data, <a onClick={refetch}>klik untuk refresh.</a>
            </>
          }
          type="error"
          className="mb-3"
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
      {/* <AddVehicle
        isOpenModal={openModal.add}
        toggle={() => toggleModal('add')}
      />
      {selectedData && (
        <UpdateVehicle
          isOpenModal={openModal.update}
          toggle={() => toggleModal('update')}
          data={selectedData}
          clearData={clearSelectedData}
        />
      )} */}
    </section>
  );
}
