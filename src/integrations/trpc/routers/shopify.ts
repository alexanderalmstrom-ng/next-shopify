import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { getProducts } from "@/utils/product";

export const shopifyRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return getProducts();
  }),
});
