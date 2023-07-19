'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { redirect, useRouter } from 'next/navigation';
import { Alert, Button, List, Select, Skeleton, Steps, message } from 'antd';
import { MdOutlineDomainVerification, MdPayment } from 'react-icons/md';
import { useGetProductDetailQuery } from '@/redux/reducers/productQuery';
import Image from 'next/image';
import dayjs from 'dayjs';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { createReservationData } from '@/redux/reducers/reservationSlice';
import { useAddReservationMutation } from '@/redux/reducers/reservationQuery';

export default function Confirmation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { accessToken } = useAppSelector((state) => state.auth);
  const reservationData = useAppSelector((state) => state.reservation);

  const { data, isFetching, error, refetch } = useGetProductDetailQuery({
    type: reservationData?.type,
    productId:
      reservationData?.type === 'rental'
        ? reservationData?.vehicleId
        : reservationData?.tourId,
  });

  const [
    createReservation,
    {
      data: dataReservation,
      isLoading,
      error: errorReservation,
      isSuccess,
      reset,
    },
  ] = useAddReservationMutation();

  const changePaymentHandler = useCallback(
    (value: string) => {
      dispatch(createReservationData({ payment: value }));
    },
    [dispatch]
  );

  const createReservationHandler = useCallback(() => {
    createReservation({ accessToken, ...reservationData });
  }, [accessToken, createReservation, reservationData]);

  useEffect(() => {
    if (!reservationData) redirect('/');
  }, [reservationData]);

  useEffect(() => {
    if (isSuccess) {
      message.success('Berhasil reservasi, silakan melakukan pembayaran.');
      setTimeout(() => {
        if (dataReservation?.paymentUrl)
          window.open(dataReservation?.paymentUrl, '_blank') ||
            window.location.replace(dataReservation?.paymentUrl);
        router.push(`/payment/${dataReservation.id}`);
        reset();
      }, 500);
    }
  }, [isSuccess]);

  return (
    reservationData && (
      <section className="w-full px-[5%] sm:px-[10%] py-6 flex flex-col">
        <main className="flex-1 w-full p-4 max-w-[1200px] mx-auto flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <Steps
            items={[
              {
                title: 'Konfirmasi',
                status: 'process',
                icon: (
                  <div className="flex justify-center items-center">
                    <MdOutlineDomainVerification className="text-3xl" />
                  </div>
                ),
              },
              {
                title: 'Pembayaran',
                status: 'wait',
                icon: (
                  <div className="flex justify-center items-center">
                    <MdPayment className="text-3xl" />
                  </div>
                ),
              },
            ]}
            className="max-w-[320px] mx-auto"
          />
          {error && !data && (
            <Alert
              message={
                <>
                  Gagal menarik data,{' '}
                  <a onClick={refetch}>klik untuk refresh.</a>
                </>
              }
              type="error"
              className="mb-3"
              showIcon
              closable
            />
          )}
          <h2 className="text-3xl font-bold">Konfirmasi Reservasi</h2>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-2">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                {isFetching ? (
                  <>
                    <Skeleton.Image active />
                    <Skeleton.Input active size="large" />
                  </>
                ) : (
                  data && (
                    <>
                      <div className="relative w-[120px] aspect-[4/3] rounded overflow-hidden">
                        <Image
                          src={data?.images[0]}
                          alt={data?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h2 className="text-2xl font-bold">{data?.name}</h2>
                    </>
                  )
                )}
              </div>
              <List itemLayout="horizontal">
                {isFetching ? (
                  <>
                    <List.Item>
                      <Skeleton.Input active size="large" block />
                    </List.Item>
                    <List.Item>
                      <Skeleton.Input active size="large" block />
                    </List.Item>
                  </>
                ) : (
                  data && (
                    <>
                      <List.Item>{`${dayjs(reservationData.startDate).format(
                        'DD MMMM YYYY'
                      )} – ${dayjs(reservationData.endDate).format(
                        'DD MMMM YYYY'
                      )}`}</List.Item>
                      <List.Item>
                        {reservationData.type === 'rental' &&
                          (reservationData.addOn
                            ? 'Dengan Driver'
                            : 'Tanpa Driver')}
                      </List.Item>
                    </>
                  )
                )}
              </List>
              {/* <p>{JSON.stringify(data)}</p> */}
            </div>
            <div className="w-[1px] bg-gray-300 dark:bg-gray-600" />
            <div className="flex flex-col justify-between">
              <List itemLayout="horizontal">
                {isFetching ? (
                  <>
                    <List.Item>
                      <Skeleton.Input active size="large" block />
                    </List.Item>
                    <List.Item>
                      <Skeleton.Input active size="large" block />
                    </List.Item>
                  </>
                ) : (
                  <>
                    <List.Item className="flex gap-2 justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-bold">Harga</p>
                        {reservationData?.type === 'rental' && (
                          <p>
                            {Math.abs(
                              dayjs(reservationData?.startDate).diff(
                                dayjs(reservationData?.endDate),
                                'day'
                              ) === 0
                                ? 1
                                : dayjs(reservationData?.startDate).diff(
                                    dayjs(reservationData?.endDate),
                                    'day'
                                  )
                            )}{' '}
                            x Rp {delimiterFormatter(data?.price ?? 0)}
                          </p>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold">
                        Rp{' '}
                        {reservationData?.type === 'rental'
                          ? delimiterFormatter(
                              Math.abs(
                                dayjs(reservationData?.startDate).diff(
                                  dayjs(reservationData?.endDate),
                                  'day'
                                ) === 0
                                  ? 1
                                  : dayjs(reservationData?.startDate).diff(
                                      dayjs(reservationData?.endDate),
                                      'day'
                                    )
                              ) * (data?.price ?? 0)
                            )
                          : delimiterFormatter(data?.price ?? 0)}
                      </h3>
                    </List.Item>
                    {reservationData?.addOn && !data?.driverMandatory && (
                      <List.Item className="flex gap-2 justify-between items-center">
                        <div className="flex flex-col gap-2">
                          <p className="text-lg font-bold">Driver</p>
                          {reservationData?.type === 'rental' && (
                            <p>
                              {Math.abs(
                                dayjs(reservationData?.startDate).diff(
                                  dayjs(reservationData?.endDate),
                                  'day'
                                ) === 0
                                  ? 1
                                  : dayjs(reservationData?.startDate).diff(
                                      dayjs(reservationData?.endDate),
                                      'day'
                                    )
                              )}{' '}
                              x Rp {delimiterFormatter(250000)}
                            </p>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold">
                          Rp{' '}
                          {delimiterFormatter(
                            Math.abs(
                              dayjs(reservationData?.startDate).diff(
                                dayjs(reservationData?.endDate),
                                'day'
                              ) === 0
                                ? 1
                                : dayjs(reservationData?.startDate).diff(
                                    dayjs(reservationData?.endDate),
                                    'day'
                                  )
                            ) * 250000
                          )}
                        </h3>
                      </List.Item>
                    )}
                  </>
                )}
              </List>

              <div className="flex flex-col gap-4">
                {isFetching ? (
                  <>
                    <Skeleton.Input active size="large" block />
                    <Skeleton.Input active size="large" block />
                    <Skeleton.Input active size="large" block />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">Total</p>
                      <h2 className="text-4xl font-bold text-[#ff6a30] m-0">
                        Rp {delimiterFormatter(reservationData.total)}
                      </h2>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">Pembayaran</p>
                      <Select
                        placeholder="Pilih pembayaran"
                        allowClear
                        onChange={changePaymentHandler}
                        options={[
                          { value: 'cash', label: 'Tunai' },
                          { value: 'cashless', label: 'Non Tunai' },
                        ]}
                        size="large"
                        className="w-[180px]"
                      />
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      loading={isLoading}
                      disabled={
                        !reservationData?.type ||
                        !reservationData?.startDate ||
                        !reservationData?.endDate ||
                        !reservationData?.total ||
                        !reservationData?.payment ||
                        !(reservationData?.vehicleId || reservationData?.tourId)
                      }
                      onClick={createReservationHandler}
                    >
                      Bayar
                    </Button>
                    {errorReservation && (
                      <p className="text-red-500">{errorReservation.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </section>
    )
  );
}
