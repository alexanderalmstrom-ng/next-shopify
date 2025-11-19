"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProductsQuery } from "@/gql/graphql";
import { api } from "@/trpc/react";
import ProductCard from "./ProductCard";

type MediaNode =
  ProductsQuery["products"]["edges"][number]["node"]["media"]["nodes"][number];

function isMediaImage(
  node: MediaNode,
): node is Extract<MediaNode, { __typename?: "MediaImage" }> {
  return node.__typename === "MediaImage";
}

export default function ProductList() {
  const utils = api.useUtils();
  const { data: products } = useSuspenseQuery(
    utils.shopify.products.queryOptions(),
  );

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
