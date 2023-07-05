import { Carousel } from 'antd';

export default function Hero() {
  return (
    <section className="h-[calc(calc(100vh-4rem)/2)] max-h-[300px]">
      <Carousel autoplay>
        <div className="bg-gray-200 h-[calc(calc(100vh-4rem)/2)] max-h-[300px]">
          <div className="h-full w-full flex justify-center items-center">
            1
          </div>
        </div>
        <div className="bg-gray-200 h-[calc(calc(100vh-4rem)/2)] max-h-[300px]">
          <div className="h-full w-full flex justify-center items-center">
            2
          </div>
        </div>
        <div className="bg-gray-200 h-[calc(calc(100vh-4rem)/2)] max-h-[300px]">
          <div className="h-full w-full flex justify-center items-center">
            3
          </div>
        </div>
      </Carousel>
    </section>
  );
}
