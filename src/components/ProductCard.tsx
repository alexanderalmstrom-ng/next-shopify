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
    <Link className="bg-amber-50/30" href={`/product/${productHandle}`}>
      {productImageUrl && (
        <Image
          className="w-full h-full object-contain aspect-square mix-blend-multiply"
          src={productImageUrl}
          alt={productImageAltText ?? productName}
          loading="eager"
          width={productImageWidth}
          height={productImageHeight}
          sizes="100vw"
        />
      )}
      <h3>{productName}</h3>
    </Link>
  );
}
