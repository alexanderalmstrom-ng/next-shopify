import { graphql } from "@/gql";
import shopifyClient from "@/services/shopify/client";

const getProductBySlugQuery = graphql(`
  query ProductBySlug($slug: String!) {
    product(handle: $slug) {
      id
      title
      description
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
    }
  }
`);

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  return <div>{product?.title}</div>;
}

async function getProductBySlug(slug: string) {
  return (await shopifyClient(getProductBySlugQuery, { slug })).data?.product;
}
