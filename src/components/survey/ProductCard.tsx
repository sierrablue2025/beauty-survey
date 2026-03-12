import { RakutenItem } from "@/lib/rakuten-api";

interface ProductCardProps {
  item: RakutenItem;
}

export function ProductCard({ item }: ProductCardProps) {
  const imageUrl = item.mediumImageUrls?.[0]?.imageUrl;
  const url = item.affiliateUrl || item.itemUrl;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl border border-[#E7DED8] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
    >
      {imageUrl && (
        <div className="w-full aspect-square bg-[#FAF8F6] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={item.itemName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[13px] text-[#6E6763] line-clamp-1">{item.shopName}</p>
        <p className="text-[14px] font-medium text-[#3E3A39] line-clamp-2 leading-snug flex-1">
          {item.itemName}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[15px] font-bold text-[#3E3A39]">
            ¥{item.itemPrice.toLocaleString()}
          </span>
          {item.reviewAverage > 0 && (
            <span className="text-[12px] text-[#6E6763]">
              ★{item.reviewAverage.toFixed(1)}
              <span className="ml-1 text-[11px]">({item.reviewCount})</span>
            </span>
          )}
        </div>
        <span className="mt-2 block text-center text-[13px] font-semibold text-white bg-[#D8B4A0] rounded-full py-1.5 hover:bg-[#C89A82] transition-colors">
          楽天で見る
        </span>
      </div>
    </a>
  );
}
