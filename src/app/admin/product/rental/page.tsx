'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useDeleteProductMutation,
  useGetProductListQuery,
} from '@/redux/reducers/productQuery';
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

export interface DataType {
  number: number;
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: string;
  transmission: 'manual' | 'automatic';
  quantity: string;
  driverMandatory: boolean;
  images: string[];
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function RentalAdmin() {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [params, setParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [search, setSearch] = useState('');
  const debouncedSearchQuery = useDebounce(search, 500);
  const [openModal, setOpenModal] = useState({
    detail: false,
    add: false,
    update: false,
  });

  const toggleModal = useCallback((type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const [selectedData, setSelectedData] = useState<DataType>(null);

  const { data, isFetching, error, refetch } = useGetProductListQuery(
    {
      type: 'rental',
      q: debouncedSearchQuery,
      limit: params.pagination.pageSize,
      page: params.pagination.current,
      sortBy: 'newest',
    },
    { refetchOnFocus: true }
  );

  const [
    deleteVehicle,
    { isLoading: isDeleting, error: errorDeleting, isSuccess: isDeleted },
  ] = useDeleteProductMutation();

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
      },
      {
        title: 'Nama',
        dataIndex: 'name',
        render: (value, record) => (
          <div className="flex gap-2 items-center">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {record.images.map((image, index) => (
                <div key={index} className={clsx(index > 0 ? 'hidden' : '')}>
                  <Image
                    src={image}
                    alt={value}
                    height={32}
                    width={48}
                    className="object-cover"
                    fallback="data:image/png;base64,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"
                  />
                </div>
              ))}
            </Image.PreviewGroup>
            {value}
          </div>
        ),
      },
      {
        title: 'Harga',
        dataIndex: 'price',
      },
      {
        title: 'Kapasitas',
        dataIndex: 'capacity',
      },
      {
        title: 'Transmisi',
        dataIndex: 'transmission',
      },
      {
        title: 'Jumlah Armada',
        dataIndex: 'quantity',
      },
      {
        title: 'Driver / Lepas Kunci',
        dataIndex: 'driverMandatory',
        render: (driverMandatory: boolean) =>
          driverMandatory ? (
            <Tag color="volcano">Driver</Tag>
          ) : (
            <span className="flex gap-1">
              <Tag color="volcano">Driver</Tag>
              <Tag color="geekblue">Lepas Kunci</Tag>
            </span>
          ),
      },
      {
        title: 'Aksi',
        dataIndex: 'action',
        render: (_, record) => (
          <div className="flex gap-4">
            <Tooltip title="edit">
              <a
                className="text-lg"
                onClick={() => {
                  setSelectedData(record);
                  toggleModal('update');
                }}
              >
                <AiFillEdit />
              </a>
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Hapus kendaraan"
              description="Apakah anda yakin akan menghapus?"
              onConfirm={() =>
                deleteVehicle({
                  accessToken,
                  type: 'rental',
                  productId: record.id,
                })
              }
              okButtonProps={{ loading: isDeleting }}
              okText="Ya"
              cancelText="Batal"
            >
              <Tooltip title="delete">
                <a className="text-lg">
                  <AiFillDelete color="red" />
                </a>
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [accessToken, deleteVehicle, isDeleting, toggleModal]
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

  const searchHandler = useCallback((e: any) => setSearch(e.target.value), []);

  const clearSelectedData = useCallback(() => {
    setSelectedData(null);
  }, []);

  useEffect(() => {
    if (isDeleted) message.success('Berhasil menghapus kendaraan');
    if (errorDeleting)
      message.success('Gagal menghapus kendaraan, silakan coba lagi');
  }, [errorDeleting, isDeleted]);

  return (
    <section className="p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold">Kendaraan</h1>
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between sm:items-center mb-3">
        <Input.Search
          placeholder="Cari produk"
          onChange={searchHandler}
          className="max-w-[480px]"
          size="large"
          allowClear
        />
        <Button
          type="primary"
          size="large"
          onClick={() => toggleModal('add')}
          className="flex gap-1 justify-center items-center"
        >
          <IoAdd />
          Tambah
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
      <AddVehicle
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
      )}
    </section>
  );
}
