import z from "zod";
import type { TypedDocumentString } from "@/gql/graphql";

const shopifyErrorSchema = z.object({
  message: z.string(),
  extensions: z
    .object({
      code: z.string().optional(),
    })
    .optional(),
  locations: z
    .array(
      z.object({
        line: z.number(),
        column: z.number(),
      }),
    )
    .optional(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
});

const shopifyResponseSchema = <TResult>() =>
  z.object({
    data: z.custom<TResult | null>(
      (val) => val === null || typeof val === "object",
    ),
    errors: z.array(shopifyErrorSchema).optional(),
    extensions: z.object({
      cost: z.object({
        requestedQueryCost: z.number(),
      }),
    }),
  });

export default async function shopifyClient<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
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
        variables: variables || undefined,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Shopify API error:", errorData);
    throw new Error(`Failed to fetch Shopify API: ${response.statusText}`);
  }

  const json = await response.json();

  console.log("json", json);

  const validation = shopifyResponseSchema<TResult>().safeParse(json);

  if (!validation.success) {
    console.error("Validation error:", validation.error);
    throw new Error(
      `Failed to validate Shopify API response: ${validation.error.message}`,
    );
  }

  const validatedData = validation.data;

  // Throw if there are GraphQL errors
  if (validatedData.errors && validatedData.errors.length > 0) {
    const errorMessages = validatedData.errors
      .map((error) => error.message)
      .join(", ");
    throw new Error(`Shopify GraphQL errors: ${errorMessages}`);
  }

  return {
    data: validatedData.data,
    errors: validatedData.errors,
    extensions: validatedData.extensions,
  };
}
