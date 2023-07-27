'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Select, Table, TablePaginationConfig, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import { Excel } from 'antd-table-saveas-excel';

import { useAppSelector } from '@/hooks';
import { useGetReservationListQuery } from '@/redux/reducers/reservationQuery';
import dayjs from 'dayjs';
import delimiterFormatter from '@/utils/delimiterFormatter';
import ActionReservation from '@/components/admin/ActionReservation';
import { BiDownload } from 'react-icons/bi';

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
  vehicleId?: string;
  tour?: any;
  tourId?: string;
  image?: string;
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

  const {
    data: exportData,
    isFetching: isFetchingExportData,
    error: errorExportData,
    refetch: refetchExportData,
  } = useGetReservationListQuery({
    accessToken,
    type: queryParams.type,
    status: queryParams.status,
    sortBy: queryParams.sortBy,
  });

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
        title: 'User',
        dataIndex: 'user',
      },
      {
        title: 'Telepon',
        dataIndex: 'phone',
        render: (value) => value ?? '-',
      },
      {
        title: 'Produk',
        dataIndex: 'product',
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
      {
        title: 'Aksi',
        render: (value, record) => (
          <ActionReservation id={record.id} status={record.status} />
        ),
      },
    ],
    [params.pagination]
  );

  const columnsExcel = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Tipe',
        dataIndex: 'type',
        key: 'type',
        render: (value) => (value === 'rental' ? 'RENTAL' : 'TRIP'),
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: 'Telepon',
        dataIndex: 'phone',
        key: 'phone',
        render: (value) => value ?? '-',
      },
      {
        title: 'Produk',
        dataIndex: 'product',
        key: 'product',
      },
      {
        title: 'Tanggal Mulai',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (value) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tanggal Selesai',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (value) => dayjs(value).format('DD MMM YYYY'),
      },
      {
        title: 'Tambahan',
        dataIndex: 'addOn',
        key: 'addOn',
        render: (value) => value ?? '-',
      },
      {
        title: 'Total (Rp)',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: 'Pembayaran',
        dataIndex: 'payment',
        key: 'payment',
        render: (value) => (value === 'case' ? 'Tunai' : 'Non Tunai'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value) =>
          value === 'cancelled'
            ? 'Dibatalkan'
            : value === 'paid'
            ? 'Terbayar'
            : value === 'pending'
            ? 'Pending'
            : value === 'confirmed'
            ? 'Terkonfirmasi'
            : value === 'finished'
            ? 'Selesai'
            : value,
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
    []
  );

  const tableData = useMemo<DataType[]>(
    () =>
      data?.data
        ? data.data.map((data) => ({
            ...data,
            user: data?.user?.name,
            phone: data?.user?.phone,
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

  const exportTableData = useMemo<DataType[]>(
    () =>
      exportData?.data
        ? exportData.data.map((data) => ({
            ...data,
            user: data?.user?.name,
            phone: data?.user?.phone,
            product:
              data?.type === 'rental' ? data?.vehicle?.name : data?.tour?.name,
            image:
              data?.type === 'rental'
                ? data?.vehicle?.imageUrl
                : data?.tour?.imageUrl,
          }))
        : [],
    [exportData?.data]
  );

  const tableChangeHandler = useCallback(
    (pagination: TablePaginationConfig) => {
      setParams({
        pagination,
      });
    },
    []
  );

  const exportHandler = useCallback(() => {
    const excel = new Excel();
    excel
      .addSheet('Rekap')
      .addColumns(columnsExcel)
      .addDataSource(exportTableData, {
        str2Percent: true,
      })
      .saveAs(`Rekap ${dayjs().format('DD-MM-YY HHmm')}.xlsx`);
  }, [columnsExcel, exportTableData]);

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
        <Button
          type="primary"
          onClick={exportHandler}
          size="large"
          className="w-[150px] flex gap-1 justify-center items-center"
          loading={isFetchingExportData}
          disabled={!exportData || isFetchingExportData}
        >
          <BiDownload />
          Ekspor Data
        </Button>
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
        pagination={{
          ...params.pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isFetching}
        onChange={tableChangeHandler}
        scroll={{ x: true }}
      />
    </section>
  );
}
