import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getProducts } from "@/utils/product";

export const shopifyRouter = createTRPCRouter({
  products: publicProcedure.query(() => getProducts()),
});
