import Image from "next/image";
import { getFragmentData, graphql } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import shopifyClient from "@/services/shopify/client";

const mediaImageFragment = graphql(`
  fragment mediaImage on MediaImage {
    __typename
    id
    image {
      url
      altText
      width
      height
    }
  }
`);

const productBySlugQuery = graphql(`
  query ProductBySlug($slug: String!) {
    product(handle: $slug) {
      id
      title
      description
      media(first: 1) {
        nodes {
          ...mediaImage
        }
      }
    }
  }
`);

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  const images = resolveProductImages(product);

  return (
    <main>
      <h1>{product?.title}</h1>
      {product?.description && <p>{product?.description}</p>}
      {images?.map(
        (image) =>
          image?.image?.url && (
            <Image
              key={image.id}
              src={image.image.url}
              alt={image.image.altText ?? ""}
              width={image.image.width ?? 2000}
              height={image.image.height ?? 2000}
              className="w-full h-full object-fit mix-blend-multiply"
            />
          ),
      )}
    </main>
  );
}

async function getProductBySlug(slug: string) {
  return (await shopifyClient(productBySlugQuery, { slug })).data?.product;
}

function resolveProductImages(product: ProductBySlugQuery["product"]) {
  return product?.media?.nodes.map((node) =>
    node.__typename === "MediaImage"
      ? getFragmentData(mediaImageFragment, node)
      : undefined,
  );
}
