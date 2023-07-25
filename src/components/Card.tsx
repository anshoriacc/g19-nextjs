import Image from 'next/image';
import React from 'react';
import { GiSandsOfTime, GiSteeringWheel } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { BsFillCalendarDateFill, BsKeyFill } from 'react-icons/bs';
import delimiterFormatter from '@/utils/delimiterFormatter';
import { Skeleton } from 'antd';
import { FaPeopleGroup } from 'react-icons/fa6';

interface Props {
  data?: any;
  type?: 'rental' | 'tour' | string;
  loading?: boolean;
}

export default function Card({ type, data, loading }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl h-60 overflow-hidden shadow-sm hover:shadow-lg text text-black dark:text-white flex flex-col">
      <div className="flex-1 relative bg-white">
        {loading ? (
          <Skeleton.Image
            active
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <Image
            src={data.images[0]}
            alt={data.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-2 bottom-0 w-full bg-white dark:bg-gray-900 border-0 border-t border-solid border-t-gray-300 dark:border-t-gray-600 flex flex-col gap-1">
        {loading ? (
          <Skeleton.Input size="small" active />
        ) : (
          <h3 className="font-bold text-base line-clamp-1 m-0">{data.name}</h3>
        )}
        {loading ? (
          <Skeleton.Input size="small" active block />
        ) : (
          <div className="flex flex-wrap gap-2 text-xs">
            {type === 'rental' && (
              <>
                {data?.transmission && (
                  <span className="flex items-center uppercase">
                    <GiSteeringWheel className="text-[#00aeef]" />
                    {data?.transmission}
                  </span>
                )}
                {data?.capacity && (
                  <span className="flex items-center uppercase">
                    <MdAirlineSeatReclineExtra className="text-[#00aeef]" />
                    {data?.capacity} orang
                  </span>
                )}
                <span className="flex items-center uppercase">
                  <BsKeyFill className="text-[#00aeef]" />
                  {data?.driverMandatory ? 'driver' : 'driver / lepas kunci'}
                </span>
              </>
            )}
            {type === 'tour' && (
              <>
                {data?.duration && (
                  <span className="flex items-center uppercase">
                    <GiSandsOfTime className="text-[#00aeef]" />
                    {data?.duration} hari
                  </span>
                )}
                {data?.capacity && (
                  <span className="flex items-center uppercase">
                    <FaPeopleGroup className="text-[#00aeef]" />
                    {data?.capacity} orang
                  </span>
                )}
                {data?.availability && (
                  <span className="flex items-center uppercase">
                    <BsFillCalendarDateFill className="text-[#00aeef]" />
                    {data?.availability === 'everyday'
                      ? 'setiap hari'
                      : 'terjadwal'}
                  </span>
                )}
              </>
            )}
          </div>
        )}
        {loading ? (
          <Skeleton.Input active />
        ) : (
          <h3
            className="font-bold text-[#ff6a30] text-xl m-0 line-clamp-1"
            title={`Rp ${delimiterFormatter(data.price)}${
              type === 'rental' ? '/hari' : ''
            }`}
          >
            Rp {delimiterFormatter(data.price)}{' '}
            {type === 'rental' && (
              <span className="text-gray-500 font-noormal text-sm">/hari</span>
            )}
          </h3>
        )}
      </div>
    </div>
  );
}
