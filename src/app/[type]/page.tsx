'use client';

import { useCallback, useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useGetProductListQuery } from '@/redux/reducers/productQuery';
import { AiFillHome } from 'react-icons/ai';
import {
  Alert,
  Breadcrumb,
  Empty,
  Input,
  Pagination,
  PaginationProps,
  Select,
} from 'antd';
import useDebounce from '@/hooks/useDebounce';
import Card from '@/components/Card';
import Link from 'next/link';

const typePath = ['rental', 'tour'];

export default function Product() {
  const params = useParams();
  const { type } = params;
  const [searchParams, setSearchParams] = useState({
    q: null,
    sortBy: 'newest',
    limit: 10,
    page: 1,
  });

  const debouncedSearchQuery = useDebounce(searchParams.q, 500);

  const { data, isFetching, error, refetch } = useGetProductListQuery({
    type,
    q: debouncedSearchQuery,
    sortBy: searchParams.sortBy ?? 'newest',
    limit: searchParams.limit,
    page: searchParams.page,
  });

  const changeParamsHandler = useCallback((params: string, value: any) => {
    setSearchParams((prev) => ({ ...prev, [params]: value }));
  }, []);

  const changeLimitHandler: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    changeParamsHandler('limit', pageSize);
  };

  const changePageHandler = useCallback<PaginationProps['onChange']>((page) => {
    changeParamsHandler('page', page);
  }, []);

  useEffect(() => {
    if (!typePath.includes(type)) notFound();
  }, [type]);

  return (
    <section className="w-full px-[5%] sm:px-[10%] py-6 flex flex-col">
      <Breadcrumb
        separator=">"
        className="w-full mb-3 max-w-[1200px] mx-auto"
        items={[
          {
            title: <AiFillHome />,
            href: '/',
          },
          {
            title: type,
          },
        ]}
      />
      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col gap-4">
        {error && (
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
        <h1 className="text-3xl font-bold capitalize m-0">
          {type === 'rental'
            ? 'Rental Kendaraan'
            : type === 'tour'
            ? 'Trip Wisata'
            : type}
        </h1>
        <div className="flex gap-4">
          <Input.Search
            placeholder="Cari produk"
            onChange={(e) => changeParamsHandler('q', e.target.value)}
            className="max-w-[480px]"
            size="large"
            allowClear
          />
          <Select
            defaultValue="newest"
            onChange={(value) => changeParamsHandler('sortBy', value)}
            options={[
              { value: 'newest', label: 'Paling baru' },
              { value: 'oldest', label: 'Paling lama' },
              { value: 'lowest_price', label: 'Termurah' },
              { value: 'highest_price', label: 'Termahal' },
            ]}
            size="large"
            className="w-fit"
          />
        </div>
        {isFetching ? (
          <div className="grid grid-cols-[repeat(2,_1fr)] md:grid-cols-[repeat(3,_1fr)] xl:grid-cols-[repeat(4,_1fr)] gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} loading />
            ))}
          </div>
        ) : data && data?.data?.length > 0 ? (
          <div className="grid grid-cols-[repeat(2,_1fr)] md:grid-cols-[repeat(3,_1fr)] xl:grid-cols-[repeat(4,_1fr)] gap-4">
            {data?.data?.map((product, index) => (
              <Link key={index} href={`/${type}/${product.id}`}>
                <Card data={product} type={type} />
              </Link>
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="self-center" />
        )}
        {data && (
          <Pagination
            total={data?.meta?.totalData ?? 0}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            showSizeChanger
            defaultPageSize={searchParams.limit}
            defaultCurrent={searchParams.page}
            className="w-fit ml-auto mt-auto"
            onChange={changePageHandler}
            onShowSizeChange={changeLimitHandler}
          />
        )}
      </main>
    </section>
  );
}
