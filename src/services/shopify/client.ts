import z from "zod";
import type { TypedDocumentString } from "@/gql/graphql";

const shopifyClientSchema = <TResult>(TResult: z.ZodType<TResult>) =>
  z.object({
    data: TResult.nullable(),
    errors: z.array(
      z.object({
        message: z.string(),
        extensions: z.object({
          code: z.string(),
        }),
        locations: z.array(
          z.object({
            line: z.number(),
            column: z.number(),
          }),
        ),
        path: z.array(z.string()),
      }),
    ),
    extensions: z.object({
      code: z.string(),
    }),
  });

export type ShopifyClientResponse<TResult> = z.infer<
  ReturnType<typeof shopifyClientSchema<TResult>>
>;

export default async function shopifyClient<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: Record<string, unknown>,
) {
  const response = await fetch(
    `https://${z
      .string()
      .min(1, "SHOPIFY_SHOP_NAME is required")
      .parse(
        process.env.SHOPIFY_SHOP_NAME,
      )}.myshopify.com/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": z
          .string()
          .min(1, "SHOPIFY_ACCESS_TOKEN is required")
          .parse(process.env.SHOPIFY_ACCESS_TOKEN),
      },
      body: JSON.stringify({
        query: query.toString(),
        variables: variables ? JSON.stringify(variables) : undefined,
      }),
    },
  );

  if (!response.ok) {
    console.error(await response.json());
    throw new Error(`Failed to fetch Shopify API: ${response.statusText}`);
  }

  const json = await response.json();
  const validation = shopifyClientSchema<TResult>(json).safeParse(json);

  if (!validation.success) {
    console.error(validation.error);
    throw new Error(
      `Failed to validate Shopify API response: ${validation.error.message}`,
    );
  }

  return validation.data;
}
