import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  inStock?: boolean;
  isComingSoon?: boolean;
  tag?: string;
}

export default function ProductCard({ 
  id, slug, name, price, originalPrice, imageUrl, category, inStock = true, isComingSoon = false, tag 
}: ProductCardProps) {
  return (
    <div className={`group relative flex flex-col bg-white border border-gray-100 hover:border-transparent hover:shadow-[0_20px_40px_-15px_rgba(107,76,138,0.12)] transition-all duration-500 rounded-2xl overflow-hidden ${(!inStock || isComingSoon) ? 'opacity-80' : ''}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 p-3 flex items-center justify-center">
        
        {/* Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isComingSoon && (
            <span className="px-3 py-1 text-[10px] font-bold text-white bg-black/80 backdrop-blur-sm rounded-full shadow-sm tracking-wider uppercase">
              Coming Soon
            </span>
          )}

          {!isComingSoon && tag && (
            <span className={`px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm rounded-full shadow-sm tracking-wider uppercase ${
              tag === 'SALE' ? 'bg-red-500/90' : (tag === 'NEW' ? 'bg-emerald-500/90' : 'bg-[#6B4C8A]/90')
            }`}>
              {tag}
            </span>
          )}
        </div>
        
        {!isComingSoon && !inStock && (
          <span className="absolute top-3 right-3 z-10 px-3 py-1 text-[10px] font-bold text-gray-800 bg-white/90 backdrop-blur-sm rounded-full shadow-sm tracking-wider uppercase">
            Out of Stock
          </span>
        )}

        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={400}
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-110 h-full w-full mix-blend-multiply"
        />
        
        {/* Quick Add Button overlay */}
        {inStock && !isComingSoon && (
          <div className="absolute inset-x-0 bottom-4 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <Link href={`/product/${slug}`} className="w-full flex items-center justify-center bg-white/95 backdrop-blur-md text-[#6B4C8A] py-3 px-4 font-bold text-sm hover:bg-[#6B4C8A] hover:text-white transition-colors rounded-full shadow-xl border border-white/20">
              View Details
            </Link>
          </div>
        )}
      </div>
      
      <div className="p-5 text-center flex flex-col flex-grow justify-between bg-white relative z-20">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">{category}</p>
        <Link href={`/product/${slug}`}>
          <h3 className="text-[15px] font-medium text-gray-900 hover:text-[#6B4C8A] transition-colors line-clamp-2 min-h-[44px] leading-tight">
            {name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-center space-x-3">
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through decoration-gray-300">Rs. {originalPrice.toFixed(2)}</span>
          )}
          <span className="text-base font-bold text-[#6B4C8A]">
            Rs. {price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

