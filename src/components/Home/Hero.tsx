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
    <section>
      <Carousel>
        {images.map((image, index) => (
          <div key={index} className="p-4 h-full flex">
            <Link
              href={image.url}
              target="_blank"
              className="block w-full max-w-[960px] mx-auto aspect-[3] relative rounded-lg overflow-hidden shadow-md"
              title="image"
            >
              <Image
                src={image.src}
                alt="bromo"
                priority
                fill
                className="object-cover"
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
