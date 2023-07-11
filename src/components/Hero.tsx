import { useMemo } from 'react';
import Link from 'next/link';

import { Carousel } from 'antd';
import bromo1 from '@/assets/images/kevin-zhang-dzFB8xeWg1M-unsplash.jpg';
import bromo2 from '@/assets/images/iswanto-arif-SqcgF3SImic-unsplash.jpg';
import bromo3 from '@/assets/images/ardito-ryan-harrisna-sC58WOuI7vM-unsplash.jpg';
import Image from 'next/image';

export default function Hero() {
  const images = useMemo(
    () => [
      { src: bromo1, url: 'https://unsplash.com/photos/dzFB8xeWg1M' },
      { src: bromo2, url: 'https://unsplash.com/photos/SqcgF3SImic' },
      { src: bromo3, url: 'https://unsplash.com/photos/sC58WOuI7vM' },
    ],
    []
  );
  return (
    <section className="h-[calc(calc(100vh-4rem)/2)]">
      <Carousel autoplay>
        {images.map((image, index) => (
          <Link key={index} href={image.url} target='_blank'>
            <div className="bg-gray-200 h-[calc(calc(100vh-4rem)/2)] relative">
              <Image
                src={image.src}
                alt="bromo"
                priority
                fill
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
