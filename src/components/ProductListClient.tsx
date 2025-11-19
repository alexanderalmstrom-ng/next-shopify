"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ProductCard from "./ProductCard";
import { isMediaImage } from "./utils/isMediaImage";

export default function ProductListClient() {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.shopify.products.queryOptions(),
  );

  if (products.length === 0) {
    return <div className="text-2xl">No products found</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
      {products.map((product) => {
        const mediaImage = product.media.nodes.filter(isMediaImage)[0];

        return (
          <ProductCard
            key={product.id}
            productName={product.title}
            productImageUrl={mediaImage?.image?.url}
            productImageAltText={mediaImage?.image?.altText}
            productHandle={product.handle}
            productImageWidth={mediaImage?.image?.width ?? undefined}
            productImageHeight={mediaImage?.image?.height ?? undefined}
          />
        );
      })}
    </div>
  );
}
