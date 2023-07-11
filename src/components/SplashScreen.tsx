import Image from 'next/image';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import g19logo from '@/assets/g19.svg';

export default function SplashScreen() {
  return (
    <section className="w-screen h-screen relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center animate-pulse">
        <div className="relative w-40 h-[72px]">
          <Image
            src={g19logo}
            alt="G19 logo"
            priority
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <p className="text-xs text-[#00aeef] font-bold flex gap-1 items-center">
          LOADING <AiOutlineLoading3Quarters className="animate-spin" />
        </p>
      </div>
    </section>
  );
}
