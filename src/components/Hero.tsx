import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="w-full bg-[#E8E6E1] py-8 sm:py-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          
          {/* Text Content */}
          <div className="w-full sm:w-1/2 p-8 sm:p-12 flex flex-col justify-center items-start">
            <h2 className="text-gray-800 font-medium text-xl sm:text-2xl mb-2 tracking-wider">
              CELEBRATING LIFE WITH
            </h2>
            <h1 className="text-5xl sm:text-7xl font-black text-[#E33535] mb-2 drop-shadow-md">
              SUMMER
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-gray-800 italic">Sale</span>
              <div className="bg-[#E33535] text-white rounded-full h-24 w-24 flex flex-col items-center justify-center transform -rotate-12 shadow-lg">
                <span className="text-3xl font-black leading-none">50%</span>
                <span className="text-sm font-bold">OFF</span>
              </div>
            </div>
            
            <Link
              href="#shop"
              className="mt-4 bg-[#E33535] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors rounded"
            >
              Shop Now
            </Link>
          </div>

          {/* Image Content */}
          <div className="w-full sm:w-1/2 relative h-[300px] sm:h-[450px]">
            {/* Since we don't have the exact collage, we'll use a placeholder that fills the space */}
            <div className="absolute inset-0 bg-gray-200 grid grid-cols-3 grid-rows-2 gap-2 p-4">
              <div className="relative col-span-1 row-span-1"><Image src="/product1.jpg" alt="Gift" fill className="object-cover rounded" /></div>
              <div className="relative col-span-2 row-span-2"><Image src="/hero.jpg" alt="Gift" fill className="object-cover rounded" /></div>
              <div className="relative col-span-1 row-span-1"><Image src="/product2.jpg" alt="Gift" fill className="object-cover rounded" /></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
