import Image from 'next/image';
import Link from 'next/link';
import { Col, Row } from 'antd';

export default function OurServices() {
  return (
    <section className="min-h-[100vh] px-[5%] sm:px-[10%] py-6 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-3xl text-center font-bold">LAYANAN KAMI</h2>
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Link href="/rental">
            <div className="relative bg-gray-500 rounded-xl h-40 overflow-hidden shadow-sm hover:shadow-lg">
              <div className="absolute w-full h-full flex justify-center items-center text-white z-20 font-bold text-xl">
                RENTAL MOBIL
              </div>
              <div className="absolute w-full h-full bg-black opacity-40 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1681965363638-0a59618faa1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="rental mobil"
                fill={true}
                className="object-cover"
              />
            </div>
          </Link>
        </Col>
        <Col span={12}>
          <Link href="/tour">
            <div className="relative bg-gray-500 rounded-xl h-40 overflow-hidden shadow-sm hover:shadow-lg">
              <div className="absolute w-full h-full flex justify-center items-center text-white z-20 font-bold text-xl">
                TRIP WISATA
              </div>
              <div className="absolute w-full h-full bg-black opacity-40 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1602154663343-89fe0bf541ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80"
                alt="trip wisata"
                fill={true}
                className="object-cover"
              />
            </div>
          </Link>
        </Col>
      </Row>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">RENTAL MOBIL</h3>
        <Row gutter={16}>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              1
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              2
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              3
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              3
            </div>
          </Col>
        </Row>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">TRIP WISATA</h3>
        <Row gutter={16}>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              1
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              2
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              3
            </div>
          </Col>
          <Col span={6}>
            <div className="bg-gray-500 rounded-xl h-40 animate-pulse shadow-sm hover:shadow-lg">
              3
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
