import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  productName: string;
  productImageUrl?: string;
  productImageAltText?: string | null;
  productHandle: string;
  productImageWidth?: number;
  productImageHeight?: number;
};

export default function ProductCard({
  productName,
  productImageUrl,
  productImageAltText,
  productHandle,
  productImageWidth,
  productImageHeight,
}: ProductCardProps) {
  return (
    <Link className="flex flex-col" href={`/product/${productHandle}`}>
      {productImageUrl && (
        <picture className="bg-amber-50">
          <Image
            className="w-full h-full object-contain aspect-square mix-blend-multiply"
            src={productImageUrl}
            alt={productImageAltText ?? productName}
            loading="eager"
            width={productImageWidth}
            height={productImageHeight}
            sizes="100vw"
          />
        </picture>
      )}
      <div className="flex flex-col gap-1 px-2 py-1">
        <h3>{productName}</h3>
      </div>
    </Link>
  );
}
