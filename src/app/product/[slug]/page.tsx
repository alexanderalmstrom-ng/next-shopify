import Image from "next/image";
import { notFound } from "next/navigation";
import { getFragmentData, graphql } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import shopifyClient from "@/services/shopify/client";

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  const images = resolveProductImages(product);

  if (!product) {
    return notFound();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {images?.map(
        (image) =>
          image?.image?.url && (
            <picture className="flex bg-amber-50">
              <Image
                key={image.id}
                src={image.image.url}
                alt={image.image.altText ?? ""}
                width={image.image.width ?? 2000}
                height={image.image.height ?? 2000}
                className="w-full h-full object-fit mix-blend-multiply"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </picture>
          ),
      )}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">{product.title}</h1>
        {product.description && <p>{product.description}</p>}
      </div>
    </div>
  );
}

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

async function getProductBySlug(slug: string) {
  return (await shopifyClient(productBySlugQuery, { slug })).data?.product;
}

const resolveProductImages = (product: ProductBySlugQuery["product"]) => {
  return product?.media?.nodes.map((node) =>
    node.__typename === "MediaImage"
      ? getFragmentData(mediaImageFragment, node)
      : undefined,
  );
};
