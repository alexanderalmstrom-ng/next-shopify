import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  prefetch(trpc.shopify.products.queryOptions());

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
