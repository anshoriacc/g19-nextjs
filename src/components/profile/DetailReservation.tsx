import { useAppSelector } from '@/hooks';
import { useGetReservationDetailQuery } from '@/redux/reducers/reservationQuery';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { Card, Divider, Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function DetailReservation({ openModal, toggleModal, data }) {
  const { accessToken } = useAppSelector((state) => state.auth);

  const {
    data: detail,
    isFetching,
    error,
    refetch,
  } = useGetReservationDetailQuery({
    accessToken,
    reservationId: data.id,
  });

  return (
    <Modal
      title="Detail Reservasi"
      open={openModal}
      onCancel={toggleModal}
      footer={null}
      centered
      width={720}
    >
      <div className="px-2 max-h-[500px] overflow-y-auto flex flex-col text-base">
        {isFetching ? (
          <>
            <Skeleton.Input active />
            <Divider dashed className="my-2" />
            <Skeleton.Input active size="small" block />
            <div className="mb-2 p-2 border border-solid rounded-lg border-[#f0f0f0] mb-4">
              <Skeleton.Input active className="mb-2" />
              <div className="flex gap-2 items-center">
                <Skeleton.Image active />
                <div className="flex flex-col gap-2">
                  <Skeleton.Input active />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="font-bold text-xl capitalize">
              {detail?.status === 'cancelled'
                ? 'Dibatalkan'
                : detail?.status === 'paid'
                ? 'Terbayar'
                : detail?.status === 'pending'
                ? 'Pending'
                : detail?.status === 'confirmed'
                ? 'Terkonfirmasi'
                : detail?.status === 'finished'
                ? 'Selesai'
                : detail?.status}
            </p>
            <Divider dashed className="my-2" />
            <div className="flex justify-between mb-4">
              <p>Tanggal Reservasi</p>
              <p>{dayjs(detail?.createdAt).format('DD MMMM YYYY, HH:mm')}</p>
            </div>
            <div className="p-2 border border-solid rounded-lg border-[#f0f0f0] mb-4">
              <p className="font-semibold mb-3">Detail Reservasi</p>
              <div className="flex gap-2 items-center">
                <div className="relative rounded-md overflow-hidden h-20 aspect-[4/3]">
                  <Image
                    src={detail?.vehicle?.imageUrl ?? detail?.tour?.imageUrl}
                    alt="product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <Link
                    href={`/${detail?.type}/${
                      detail?.vehicleId ?? detail?.tourId
                    }`}
                    className="font-semibold text-lg"
                  >
                    {detail?.vehicle?.name ?? detail?.tour?.name}
                  </Link>
                  <p>
                    Tanggal Mulai:{' '}
                    {dayjs(detail?.startDate).format('DD MMMM YYYY')}
                  </p>
                  <p>
                    Tanggal Selesai:{' '}
                    {dayjs(detail?.endDate).format('DD MMMM YYYY')}
                  </p>
                  <p>Total: Rp {delimiterFormatter(detail?.total ?? 0)}</p>
                  <p>Tambahan: {detail?.addOn ?? '-'}</p>
                  <p>
                    Pembayaran:{' '}
                    {detail?.payment === 'cash' ? 'Tunai' : 'Non Tunai'}
                  </p>
                </div>
              </div>
            </div>
            {detail?.payment === 'cashless' && (
              <div>
                <p className="font-semibold mb-2">Detail Pembayaran</p>
                <p>
                  Status:{' '}
                  {detail?.paymentDetail?.transaction_status === 'capture' ||
                  detail?.paymentDetail?.transaction_status === 'settlement'
                    ? 'Sukses'
                    : detail?.paymentDetail?.transaction_status === 'deny' ||
                      detail?.paymentDetail?.transaction_status === 'expire' ||
                      detail?.paymentDetail?.transaction_status === 'failure'
                    ? 'Gagal'
                    : 'Pending'}
                </p>
                <p>Metode: {detail?.paymentDetail?.payment_type}</p>
                <p>Total: Rp {delimiterFormatter(detail?.total ?? 0)}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
