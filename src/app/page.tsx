import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  void api.shopify.products.prefetch();

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductList />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
