import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import ReviewCarousel from '@/components/ReviewCarousel';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductGrid />
      
      {/* Feature Blocks */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Block 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-24">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Looking for the Perfect Gift?</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                At Tasweer, we believe that every gift should tell a story. Whether it's a birthday, anniversary, wedding, or just because, our personalized gifts are designed to bring a smile to your loved ones' faces. From customized name necklaces to printed magic mugs and beautiful wall frames, we have something special for everyone.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Our easy-to-use customization tools allow you to add your own personal touch, ensuring that your gift is as unique as the person receiving it.
              </p>
              <button className="mt-8 text-[#6B4C8A] font-bold text-sm border-b-2 border-[#6B4C8A] pb-1 hover:text-[#5a3e74] hover:border-[#5a3e74] transition-colors">
                READ MORE
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
                <Image src="/product1.jpg" alt="Gift idea" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
                <Image src="/hero.jpg" alt="Customization" fill className="object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality and Craftsmanship</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                We take pride in the quality of our products. Each item is carefully crafted using premium materials and state-of-the-art printing technology to ensure that your personalized gift not only looks amazing but also stands the test of time.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Enjoy free shipping all over Pakistan on orders above Rs. 3000, and experience our dedicated customer service that's always here to help you create the perfect memory.
              </p>
              <button className="mt-8 text-[#6B4C8A] font-bold text-sm border-b-2 border-[#6B4C8A] pb-1 hover:text-[#5a3e74] hover:border-[#5a3e74] transition-colors">
                READ MORE
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200 overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
        <ReviewCarousel />
      </section>
      
    </div>
  );
}
