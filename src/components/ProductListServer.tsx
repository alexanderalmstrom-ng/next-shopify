import { caller } from "@/trpc/server";
import ProductCard from "./ProductCard";
import { isMediaImage } from "./utils/isMediaImage";

export default async function ProductListServer() {
  const products = await caller.shopify.products();

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
