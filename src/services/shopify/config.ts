import z from "zod";

export const shopifyConfigSchema = z.object({
  shopName: z.string().min(1, "SHOPIFY_SHOP_NAME is required"),
  accessToken: z.string().min(1, "SHOPIFY_ACCESS_TOKEN is required"),
});

export type ShopifyConfig = z.infer<typeof shopifyConfig>;

export const shopifyConfig = shopifyConfigSchema.parse({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});
