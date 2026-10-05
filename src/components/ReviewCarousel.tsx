"use client";

import { useRef } from 'react';

const reviews = [
  {
    id: 1,
    name: "Fatima A.",
    text: "Ordered a custom name necklace for my daughter's birthday and it is absolutely stunning! The quality is amazing and it arrived within 3 days. Highly recommend Tasweer!",
    rating: 5,
  },
  {
    id: 2,
    name: "Zainab M.",
    text: "The magic mug was exactly what I was looking for. The picture quality is top-notch and the color changes instantly with hot coffee. Best gift for my husband!",
    rating: 5,
  },
  {
    id: 3,
    name: "Hassan R.",
    text: "Got a set of custom wall frames and they completely transformed our living room. Sturdy build, great finish, and exceptional packaging.",
    rating: 5,
  },
  {
    id: 4,
    name: "Ali S.",
    text: "I was skeptical about ordering custom apparel online, but the printing on the hoodies was flawless. Didn't fade after washing either!",
    rating: 4,
  },
  {
    id: 5,
    name: "Sara K.",
    text: "Customer service is top notch! I made a mistake in the spelling of a custom gift and they fixed it before printing without any hassle. Will definitely shop again.",
    rating: 5,
  },
];

export default function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? clientWidth / 2 : clientWidth; // scroll 2 cards on desktop, 1 on mobile
      
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Navigation Buttons (Desktop) */}
      <div className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-10">
        <button 
          onClick={() => scroll('left')}
          className="bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#6B4C8A] transition-colors"
          aria-label="Previous review"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
        <button 
          onClick={() => scroll('right')}
          className="bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#6B4C8A] transition-colors"
          aria-label="Next review"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel Track */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
          >
            <div className="bg-white h-full p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex text-[#F5A623] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{review.text}"</p>
              </div>
              <p className="font-bold text-gray-900">- {review.name}</p>
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
