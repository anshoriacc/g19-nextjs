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
import { useGetBannerListQuery } from '@/redux/reducers/bannerQuery';

export interface DataType {
  number: number;
  id: string;
  title: string;
  imageUrl: string;
  url: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function Banner() {
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

  const { data, isFetching, error, refetch } = useGetBannerListQuery(
    {
      accessToken,
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
      },
      {
        title: 'Judul',
        dataIndex: 'title',
      },
      {
        title: 'Gambar',
        dataIndex: 'imageUrl',
      },
      {
        title: 'Url',
        dataIndex: 'url',
      },
      {
        title: 'Aksi',
        dataIndex: 'action',
      },
    ],
    []
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
    <section className="p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-[15px]">
        <h1 className="text-3xl font-bold m-0">Banner</h1>
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
