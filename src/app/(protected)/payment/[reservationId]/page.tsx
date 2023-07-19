'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { clearReservationData } from '@/redux/reducers/reservationSlice';
import { notFound, useParams } from 'next/navigation';
import { useGetReservationDetailQuery } from '@/redux/reducers/reservationQuery';
import {
  MdOutlineCheckCircle,
  MdOutlineDomainVerification,
  MdPayment,
} from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { Alert, Button, Result, Steps } from 'antd';
import Link from 'next/link';

export default function Payment() {
  const { accessToken, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const params = useParams();
  const { reservationId } = params;

  const { data, isFetching, error, refetch } = useGetReservationDetailQuery({
    accessToken,
    reservationId,
  });

  useEffect(() => {
    if (
      !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        reservationId
      )
    ) {
      notFound();
    }
  }, [reservationId]);

  useEffect(() => {
    if (data?.userId && userInfo?.id && data?.userId !== userInfo?.id) {
      notFound();
    }
  }, [data?.userId, userInfo?.id]);

  useEffect(() => {
    if (!isFetching && data) {
      if (!(data?.status === 'paid' || data?.status === 'confirmed')) {
        setTimeout(() => {
          refetch();
        }, 5000);
      }
    }
  }, [data, isFetching, refetch]);

  useEffect(() => {
    dispatch(clearReservationData());
  }, []);

  return (
    <section className="w-full px-[5%] sm:px-[10%] py-6 flex flex-col">
      <main className="flex-1 w-full p-4 max-w-[1200px] mx-auto flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <Steps
          items={[
            {
              title: 'Konfirmasi',
              status: 'finish',
              icon: (
                <div className="flex justify-center items-center">
                  <MdOutlineDomainVerification className="text-3xl" />
                </div>
              ),
            },
            {
              title: 'Pembayaran',
              status: 'process',
              icon: (
                <div className="flex justify-center items-center">
                  <MdPayment className="text-3xl" />
                </div>
              ),
            },
          ]}
          className="max-w-[320px] mx-auto"
        />
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

        <div className="flex-1 flex justify-center items-center">
          <Result
            icon={
              !isFetching &&
              (data?.status === 'paid' || data?.status === 'confirmed') ? (
                <MdOutlineCheckCircle className="text-9xl text-green-500" />
              ) : (
                <AiOutlineLoading className="text-9xl text-[#00aeef] animate-spin" />
              )
            }
            title={
              !isFetching &&
              (data?.status === 'paid' || data?.status === 'confirmed')
                ? 'Reservasi sudah terbayar / dikonfirmasi admin'
                : 'Menunggu pembayaran / konfirmasi admin.'
            }
            extra={
              <Link href="/">
                <Button type="primary">Kembali ke beranda</Button>
              </Link>
            }
          />
        </div>
      </main>
    </section>
  );
}
