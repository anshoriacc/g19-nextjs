import { Button } from 'antd';
import Link from 'next/link';
import Map from './Map';

export default function About() {
  return (
    <section className="h-fit max-h-[calc(calc(100vh-4rem)/2)] bg-white dark:bg-gray-900 flex flex-col px-[5%] sm:px-[10%] py-6">
      <h1 className="text-3xl text-center font-bold">G19 TOUR & TRAVEL</h1>
      <div className="h-full flex flex-col md:flex-row gap-4 flex-1 items-center overflow-hidden">
        <div className="hidden sm:inline w-full max-w-[400px] h-[calc(50%-0.5rem)] md:h-full max-h-60 bg-gray-200 rounded-xl overflow-hidden">
          <Map />
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="sm:text-base text-center md:text-justify">
            G19 Tour & Travel adalah perusahaan rental kendaraan dan perjalanan
            wisata yang menawarkan pengalaman tak terlupakan. Dengan armada
            kendaraan berkualitas dan paket wisata menarik, kami hadir untuk
            memenuhi kebutuhan perjalanan anda.
          </p>
          <Link href="/" className="md:self-start">
            <Button type="primary" className="bg-[#00aeef]">
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
