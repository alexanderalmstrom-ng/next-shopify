import z from "zod";

export const shopifyErrorSchema = z.object({
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

export const shopifyResponseSchema = <TResult>() =>
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

export type ShopifyResponse<TResult> = z.infer<
  ReturnType<typeof shopifyResponseSchema<TResult>>
>;

export type ShopifyError = z.infer<typeof shopifyErrorSchema>;
