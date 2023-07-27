import Link from 'next/link';
import Image from 'next/image';
import { useGetBannerListQuery } from '@/redux/reducers/bannerQuery';
import { Carousel, Skeleton } from 'antd';
import { RxCrossCircled } from 'react-icons/rx';

export default function Hero() {
  const { data, isFetching, error, refetch } = useGetBannerListQuery({});

  return (
    <section>
      <Carousel autoplay autoplaySpeed={4000}>
        {isFetching ? (
          <div className="p-4 h-full flex">
            <div className="w-full max-w-[960px] mx-auto aspect-[3] relative rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-900 flex justify-center items-center">
              <Skeleton.Image active />
            </div>
          </div>
        ) : data ? (
          data.map((banner, index) => (
            <div key={index} className="p-4 h-full flex">
              <Link
                href={banner?.url ? banner?.url : '#'}
                target={banner?.url ? '_blank' : ''}
                className="block w-full max-w-[960px] mx-auto aspect-[3] relative rounded-lg overflow-hidden shadow-md"
                title={banner.title}
              >
                <Image
                  src={banner.imageUrl}
                  alt="bromo"
                  priority
                  fill
                  className="object-cover"
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="p-4 h-full flex">
            <div className="w-full max-w-[960px] mx-auto aspect-[3] relative rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-900 flex justify-center items-center">
              <div className="text-gray-500 text-center">
                <RxCrossCircled />
                {error && (
                  <p>
                    Gagal menarik data,{' '}
                    <a onClick={refetch}>klik untuk refresh.</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Carousel>
    </section>
  );
}
