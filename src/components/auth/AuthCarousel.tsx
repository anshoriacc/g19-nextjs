import { useMemo } from 'react';
import Image from 'next/image';

import { Carousel } from 'antd';

import bromo1 from '@/assets/images/kevin-zhang-dzFB8xeWg1M-unsplash.jpg';
import bromo2 from '@/assets/images/iswanto-arif-SqcgF3SImic-unsplash.jpg';
import bromo3 from '@/assets/images/ardito-ryan-harrisna-sC58WOuI7vM-unsplash.jpg';
import Link from 'next/link';

export default function AuthCarousel() {
  const images = useMemo(
    () => [
      { src: bromo1, url: 'https://unsplash.com/photos/dzFB8xeWg1M' },
      { src: bromo2, url: 'https://unsplash.com/photos/SqcgF3SImic' },
      { src: bromo3, url: 'https://unsplash.com/photos/sC58WOuI7vM' },
    ],
    []
  );

  return (
    <Carousel autoplay dots={false}>
      {images.map((image, index) => (
        <div key={index} className="h-[calc(100vh-4rem)] relative text-white">
          <p className="absolute bottom-[2%] left-[2%] z-30">
            Images source:{' '}
            <Link href={image.url} target="_blank">
              Unsplash
            </Link>
          </p>
          <div className="w-full h-full bg-black opacity-50 absolute z-20"></div>
          <Image
            src={image.src}
            alt="bromo"
            priority
            fill
            className="object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
}
