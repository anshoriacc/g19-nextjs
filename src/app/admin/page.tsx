'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '@/hooks';
import {
  useGetReservationListQuery,
  useGetReservationStatsQuery,
} from '@/redux/reducers/reservationQuery';
import {
  Alert,
  Card,
  DatePicker,
  DatePickerProps,
  Statistic,
  Tag,
  Table,
} from 'antd';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ActionReservation from '@/components/admin/ActionReservation';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { ColumnsType } from 'antd/es/table';
import { DataType } from './reservation/page';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardAdmin() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [year, setYear] = useState<number>(dayjs().year());

  const { data, isFetching, error, refetch } = useGetReservationStatsQuery({
    accessToken,
    year,
  });

  const onChange = useCallback<DatePickerProps['onChange']>((date) => {
    setYear(date?.year() ?? dayjs().year());
  }, []);

  const disabledDate = useCallback<DatePickerProps['disabledDate']>(
    (current) => {
      return current.year() < 2023 || current.year() > dayjs().year();
    },
    []
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chartDataTotal = useMemo(
    () => ({
      labels: data ? data?.data?.map((data) => data.month) : [],
      datasets: [
        {
          label: 'Total Pendapatan',
          data: data ? data?.data?.map((data) => data.total) : [],
          backgroundColor: 'rgb(0, 174, 239)',
          borderRadius: 5,
        },
      ],
    }),
    [data]
  );

  const chartDataCount = useMemo(
    () => ({
      labels: data ? data?.data?.map((data) => data.month) : [],
      datasets: [
        {
          label: 'Total Reservasi',
          data: data ? data?.data?.map((data) => data.count) : [],
          backgroundColor: 'rgb(0, 174, 239)',
          borderRadius: 5,
        },
      ],
    }),
    [data]
  );

  // Reservation
  const {
    data: reservationData,
    isFetching: isFetchingReservation,
    error: errorReservation,
    refetch: refetchReservation,
  } = useGetReservationListQuery(
    {
      accessToken,
      limit: 5,
      page: 1,
      sortBy: 'newest',
    },
    { refetchOnFocus: true }
  );

  const columns = useMemo<ColumnsType<DataType>>(
    () => [
      {
        title: '#',
        dataIndex: 'number',
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
        render: (value) => (value ? value : '-'),
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
        render: (value) => (value ? value : '-'),
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
    []
  );

  const tableData = useMemo<DataType[]>(
    () =>
      reservationData?.data
        ? reservationData.data.map((data) => ({
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
    [reservationData?.data]
  );

  return (
    <section className="p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DatePicker
        onChange={onChange}
        picker="year"
        disabledDate={disabledDate}
        defaultValue={dayjs()}
        className="max-w-[400px] mb-4"
        size="large"
      />
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
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card loading={isFetching}>
            <Statistic
              title="Total Reservasi"
              value={data?.count ?? 0}
              groupSeparator="."
              className="mb-4"
            />
            {data && <Bar options={options} data={chartDataCount} />}
          </Card>
          <Card loading={isFetching}>
            <Statistic
              title="Total Pendapatan"
              value={data?.total ?? 0}
              prefix="Rp"
              groupSeparator="."
              className="mb-4"
            />
            {data && <Bar options={options} data={chartDataTotal} />}
          </Card>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold m-0">Reservasi Terbaru</h2>
            <Link href="/admin/reservation" className="font-semibold">
              Selengkapnya
            </Link>
          </div>
          {errorReservation && !isFetchingReservation && (
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
            loading={isFetchingReservation}
            scroll={{ x: true }}
            pagination={false}
          />
        </div>
      </div>
    </section>
  );
}
