'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

import {
  Alert,
  Breadcrumb,
  Carousel,
  Skeleton,
  DatePicker,
  Button,
  Collapse,
  List,
  Switch,
} from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { AiFillHome } from 'react-icons/ai';
import { BsKeyFill } from 'react-icons/bs';
import { GiSandsOfTime, GiSteeringWheel } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BsFillCalendarDateFill } from 'react-icons/bs';

import { useGetProductDetailQuery } from '@/redux/reducers/productQuery';
import {
  clearReservationData,
  createReservationData,
} from '@/redux/reducers/reservationSlice';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { useAppDispatch } from '@/hooks';

export default function ProductDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { type, productId } = params;
  const [dates, setDates] = useState({ sDate: null, eDate: null });
  const [addOn, setAddOn] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isFetching, error, refetch } = useGetProductDetailQuery({
    type,
    productId,
    sDate: type === 'rental' ? dates.sDate : null,
    eDate: type === 'rental' ? dates.eDate : null,
  });

  const total = useMemo(
    () =>
      type === 'rental'
        ? data?.price && dates.sDate && dates.eDate
          ? Math.abs(
              (dayjs(dates.sDate).diff(dayjs(dates.eDate), 'day') === 0
                ? 1
                : dayjs(dates.sDate).diff(dayjs(dates.eDate), 'day')) *
                data?.price
            ) +
            (addOn && !data?.driverMandatory
              ? Math.abs(
                  (dayjs(dates.sDate).diff(dayjs(dates.eDate), 'day') === 0
                    ? 1
                    : dayjs(dates.sDate).diff(dayjs(dates.eDate), 'day')) *
                    250000
                )
              : 0)
          : data?.price ?? 0
        : data?.price,
    [addOn, data?.driverMandatory, data?.price, dates.eDate, dates.sDate, type]
  );

  const reservationData = useMemo(
    () => ({
      type,
      startDate: dates.sDate,
      endDate: dates.eDate,
      total,
      addOn,
      vehicleId: type === 'rental' ? productId : null,
      tourId: type === 'tour' ? productId : null,
    }),
    [addOn, dates.eDate, dates.sDate, productId, total, type]
  );

  const disabledDateRental = useCallback<RangePickerProps['disabledDate']>(
    (current) => {
      return current < dayjs().add(-1, 'days').endOf('day');
    },
    []
  );

  const disabledDateTour = useCallback<DatePickerProps['disabledDate']>(
    (current) => {
      return current < dayjs().endOf('day');
    },
    []
  );

  const changeDateHandlerRental = useCallback((value: Dayjs[]) => {
    if (!value) {
      return setDates({
        sDate: null,
        eDate: null,
      });
    }

    setDates({
      sDate: value[0].format('YYYY-MM-DD'),
      eDate: value[1].format('YYYY-MM-DD'),
    });
  }, []);

  const changeDateHandlerTour = useCallback(
    (value: Dayjs) => {
      if (!value) {
        return setDates({
          sDate: null,
          eDate: null,
        });
      }

      setDates({
        sDate: value.format('YYYY-MM-DD'),
        eDate: value.add((data?.duration ?? 1) - 1, 'day').format('YYYY-MM-DD'),
      });
    },
    [data?.duration]
  );

  const changeAddOnHandler = useCallback((checked: boolean) => {
    setAddOn(checked ? 'driver' : null);
  }, []);

  const createReservationHandler = useCallback(() => {
    dispatch(createReservationData(reservationData));
    setLoading(true);
    router.push('/confirmation');
  }, [dispatch, reservationData, router]);

  useEffect(() => {
    if (
      !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        productId
      )
    ) {
      notFound();
    }
  }, [productId]);

  useEffect(() => {
    setAddOn(data?.driverMandatory ? 'driver' : null);
  }, [data]);

  useEffect(() => {
    dispatch(clearReservationData());
  }, []);

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
            href: `/${type}`,
          },
          {
            title: isFetching ? (
              <Skeleton.Input size="small" />
            ) : (
              <>{data?.name}</>
            ),
          },
        ]}
      />
      <main className="flex-1 w-full p-4 max-w-[1200px] mx-auto flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md">
        {error && !data && (
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
        {isFetching && !data ? (
          <Skeleton.Input active size="large" />
        ) : (
          data?.name && <h1 className="text-3xl font-bold">{data?.name}</h1>
        )}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Carousel className="sticky">
            {isFetching && !data ? (
              <div className="p-4 h-full flex">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
                  <Skeleton.Image active />
                </div>
              </div>
            ) : (
              data?.images &&
              data?.images?.map((image, index) => (
                <div
                  key={index}
                  className="p-4 w-full aspect-[4/3] relative rounded-lg overflow-hidden bg-white"
                >
                  <Image
                    src={image}
                    alt="bromo"
                    priority
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            )}
          </Carousel>
          <div className="flex flex-col gap-4 justify-between text-base">
            <div className="flex flex-col gap-4">
              {isFetching && !data ? (
                <Skeleton.Input active size="large" />
              ) : (
                data?.price && (
                  <h2 className="font-bold text-[#00aeef] flex items-baseline items- text-3xl m-0">
                    Rp {delimiterFormatter(data?.price)}{' '}
                    {type === 'rental' && (
                      <span className="text-gray-500 font-noormal text-sm">
                        /hari
                      </span>
                    )}
                  </h2>
                )
              )}
              <div className="flex flex-wrap gap-4 font-semibold text-gray-500">
                {isFetching && !data ? (
                  <>
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                  </>
                ) : (
                  data && (
                    <>
                      {type === 'rental' && (
                        <>
                          {data?.transmission && (
                            <span className="flex items-center gap-2 uppercase">
                              <GiSteeringWheel className="text-[#ff6a30]" />
                              {data?.transmission}
                            </span>
                          )}
                          {data?.capacity && (
                            <span className="flex items-center gap-2 uppercase">
                              <MdAirlineSeatReclineExtra className="text-[#ff6a30]" />
                              {data?.capacity} orang
                            </span>
                          )}
                          <span className="flex items-center gap-2 uppercase">
                            <BsKeyFill className="text-[#ff6a30]" />
                            {data?.driverMandatory
                              ? 'driver'
                              : 'driver / lepas kunci'}
                          </span>
                        </>
                      )}
                      {type === 'tour' && (
                        <>
                          {data?.duration && (
                            <span className="flex items-center gap-2 uppercase">
                              <GiSandsOfTime className="text-[#ff6a30]" />
                              {data?.duration} hari
                            </span>
                          )}
                          {data?.capacity && (
                            <span className="flex items-center gap-2 uppercase">
                              <FaPeopleGroup className="text-[#ff6a30]" />
                              {data?.capacity} orang
                            </span>
                          )}
                          {data?.availability && (
                            <span className="flex items-center gap-2 uppercase">
                              <BsFillCalendarDateFill className="text-[#ff6a30]" />
                              {data?.availability === 'everyday'
                                ? 'setiap hari'
                                : 'terjadwal'}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )
                )}
              </div>
              {isFetching && !data ? (
                <>
                  <Skeleton.Input active block />
                  <Skeleton.Input active block />
                  <Skeleton.Input active />
                </>
              ) : (
                data?.description && <p>{data?.description}</p>
              )}
              {data?.highlights && data?.highlights?.length > 0 && (
                <Collapse
                  items={[
                    {
                      key: 'highlights',
                      label: 'Highlights',
                      children: (
                        <List
                          itemLayout="horizontal"
                          dataSource={data?.highlights}
                          renderItem={(item) => (
                            <List.Item>
                              <>{item}</>
                            </List.Item>
                          )}
                        />
                      ),
                    },
                  ]}
                />
              )}
              {data?.itineraries && data?.itineraries?.length > 0 && (
                <Collapse
                  items={[
                    {
                      key: 'itineraries',
                      label: 'Itineraries',
                      children: (
                        <List
                          itemLayout="horizontal"
                          dataSource={data?.itineraries}
                          renderItem={(item: any) => (
                            <List.Item>
                              {item?.time}: {item?.itinerary}
                            </List.Item>
                          )}
                        />
                      ),
                    },
                  ]}
                />
              )}
            </div>
            <div className="flex flex-col gap-4">
              {type === 'rental' && data && (
                <>
                  <Switch
                    checkedChildren="Pakai Driver"
                    unCheckedChildren="Tanpa Driver"
                    defaultChecked={data?.driverMandatory}
                    disabled={data?.driverMandatory}
                    onChange={changeAddOnHandler}
                    className="w-fit"
                  />
                  <div className="flex flex-col gap-2">
                    <label>Pilih tanggal</label>
                    <DatePicker.RangePicker
                      size="large"
                      disabledDate={disabledDateRental}
                      onChange={changeDateHandlerRental}
                    />
                    {dates?.sDate && dates?.eDate && (
                      <span
                        className={clsx(
                          data?.availableStock > 0
                            ? 'text-green-500'
                            : 'text-red-500',
                          'italic'
                        )}
                      >
                        {data?.availableStock > 0
                          ? `Tersedia ${data?.availableStock} armada`
                          : 'Tidak tersedia'}
                      </span>
                    )}
                  </div>
                </>
              )}

              {type === 'tour' && data && (
                <div className="flex flex-col gap-2">
                  <label>Pilih tanggal</label>
                  <DatePicker
                    size="large"
                    disabledDate={disabledDateTour}
                    onChange={changeDateHandlerTour}
                  />
                </div>
              )}
              {type === 'rental' && data && (
                <h2 className="text-4xl font-bold text-[#ff6a30] text-right">
                  Rp {delimiterFormatter(total)}
                </h2>
              )}
              <Button
                type="primary"
                size="large"
                loading={isFetching || loading}
                disabled={
                  (type === 'rental' && data?.availableStock < 1) ||
                  !(dates?.sDate && dates?.eDate) ||
                  loading
                }
                onClick={createReservationHandler}
              >
                Reservasi
              </Button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
