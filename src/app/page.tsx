import { Suspense } from "react";
// import ProductListClient from "@/components/ProductListClient";
import ProductListServer from "@/components/ProductListServer";
// import { HydrateClient } from "@/trpc/server";

// export const dynamic = "force-dynamic";

export default async function Home() {
  // prefetch(trpc.shopify.products.queryOptions());

  return (
    <main>
      {/* <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductListClient />
        </Suspense>
      </HydrateClient> */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListServer />
      </Suspense>
    </main>
  );
}
