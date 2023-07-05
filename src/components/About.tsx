import { Button } from 'antd';

export default function About() {
  return (
    <section className="h-full max-h-[calc(100vh-4rem-300px)] bg-white px-[5%] sm:px-[10%] py-6">
      <h1 className="text-3xl text-center font-bold">G19 TOUR & TRAVEL</h1>
      <div className="flex flex-col gap-4 h-[calc(100%-51px)] items-center">
        <div className="w-full max-w-[450px] h-40 bg-gray-200 rounded-xl" />
        <div className="flex flex-col flex-1 items-center">
          <p className="text-center">
            G19 Tour & Travel adalah perusahaan rental kendaraan dan perjalanan
            wisata yang menawarkan pengalaman tak terlupakan. Dengan armada
            kendaraan berkualitas dan paket wisata menarik, kami hadir untuk
            memenuhi kebutuhan perjalanan anda. Jadilah bagian dari perjalanan
            kami dan rasakan pengalaman perjalanan yang luar biasa!
          </p>
          <Button href="/" type="primary" size="large" className="bg-[#00aeef]">
            Hubungi Kami
          </Button>
        </div>
      </div>
    </section>
  );
}
