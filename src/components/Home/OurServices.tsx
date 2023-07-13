'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'antd';
import { useGetProductListQuery } from '@/redux/reducers/productQuery';

import carImages from '@/assets/images/car.avif';
import tourImages from '@/assets/images/tour.avif';
import clsx from 'clsx';

export default function OurServices() {
  const { data, isFetching, error, refetch } = useGetProductListQuery({
    type: 'rental',
    limit: 4,
    sortBy: 'newest',
  });

  return (
    <section className="min-h-[100vh] px-[5%] sm:px-[10%] py-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl text-center font-bold">LAYANAN KAMI</h2>
        <div className="grid grid-cols-[1fr_1fr] gap-4 mb-4">
          <Link href="/rental">
            <div className="relative bg-gray-500 rounded-xl h-40 overflow-hidden shadow-sm hover:shadow-lg">
              <div className="absolute w-full h-full flex justify-center items-center text-center text-white z-20 font-bold text-xl">
                RENTAL KENDARAAN
              </div>
              <div className="absolute w-full h-full bg-black opacity-40 z-10" />
              <Image
                src={carImages}
                alt="rental kendaraan"
                fill={true}
                priority
                className="object-cover"
              />
            </div>
          </Link>
          <Link href="/tour">
            <div className="relative bg-gray-500 rounded-xl h-40 overflow-hidden shadow-sm hover:shadow-lg">
              <div className="absolute w-full h-full flex justify-center items-center text-center text-white z-20 font-bold text-xl">
                TRIP WISATA
              </div>
              <div className="absolute w-full h-full bg-black opacity-40 z-10" />
              <Image
                src={tourImages}
                alt="trip wisata"
                fill={true}
                priority
                className="object-cover"
              />
            </div>
          </Link>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-bold m-0">RENTAL KENDARAAN</h3>
            <Link href="/rental" className='font-semibold'>Lebih banyak</Link>
          </div>
          <div className="grid grid-cols-[repeat(2,_1fr)] md:grid-cols-[repeat(3,_1fr)] xl:grid-cols-[repeat(4,_1fr)] gap-4">
            {data
              ? data.data.map((vehicle, index) => (
                  <div
                    key={index}
                    className={clsx(
                      index === 2 ? 'hidden' : 'md:inline',
                      index === 3 ? 'hidden' : 'xl:inline',
                      'bg-white dark:bg-gray-900 rounded-xl h-60 overflow-hidden relative shadow-sm hover:shadow-lg'
                    )}
                  >
                    <Image
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              : [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                      index === 2 ? 'hidden' : 'md:inline',
                      index === 3 ? 'hidden' : 'xl:inline',
                      'bg-gray-500 rounded-xl h-60 animate-pulse'
                    )}
                  />
                ))}
          </div>
        </div>
        <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-bold m-0">TRIP WISATA</h3>
            <Link href="/tour" className='font-semibold'>Lebih banyak</Link>
          </div>
          <div className="grid grid-cols-[repeat(2,_1fr)] md:grid-cols-[repeat(3,_1fr)] xl:grid-cols-[repeat(4,_1fr)] gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={clsx(
                  index === 2 ? 'hidden' : 'md:inline',
                  index === 3 ? 'hidden' : 'xl:inline',
                  'bg-gray-500 rounded-xl h-60 animate-pulse'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
