import Link from 'next/link';
import { Button } from 'antd';
import Map from './Map';

export default function About() {
  return (
    <section className="bg-white dark:bg-gray-900 px-[5%] sm:px-[10%] py-6">
      <div className="max-w-[1200px] mx-auto flex flex-col">
        <h1 className="text-3xl text-center font-bold">G19 TOUR & TRAVEL</h1>
        <div className="h-full grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 flex-1 justify-center items-center overflow-hidden">
          <div className="w-full max-w-[400px] mx-auto h-[calc(50%-0.5rem)] md:h-full max-h-60 bg-gray-200 rounded-xl overflow-hidden">
            <Map />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="sm:text-base text-center md:text-justify">
              G19 Tour & Travel adalah perusahaan rental kendaraan dan
              perjalanan wisata yang menawarkan pengalaman tak terlupakan.
              Dengan armada kendaraan berkualitas dan paket wisata menarik, kami
              hadir untuk memenuhi kebutuhan perjalanan anda.
            </p>
            <Link href="/" className="md:self-start">
              <Button type="primary">Hubungi Kami</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
