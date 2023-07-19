'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';

import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoAdd } from 'react-icons/io5';
import AddVehicle from '@/components/admin/AddVehicle';
import { useAppSelector } from '@/hooks';
import UpdateVehicle from '@/components/admin/UpdateVehicle';
import { useGetBannerListQuery } from '@/redux/reducers/bannerQuery';

export interface DataType {
  number: number;
  id: string;
  title: string;
  imageUrl: string;
  url: string;
}

export default function Banner() {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState({
    detail: false,
    add: false,
    update: false,
  });

  const toggleModal = useCallback((type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const { data, isFetching, error, refetch } = useGetBannerListQuery(
    {
      accessToken,
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
        title: 'Gambar',
        dataIndex: 'imageUrl',
      },
      {
        title: 'Judul',
        dataIndex: 'title',
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

  const tableData = useMemo<DataType[]>(() => data ?? [], [data]);

  return (
    <section className="min-h-full p-4 bg-white dark:bg-gray-900 flex flex-col rounded-lg overflow-hidden">
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
        pagination={false}
        loading={isFetching}
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
