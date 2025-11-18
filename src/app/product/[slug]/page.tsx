import { graphql } from "@/gql";
import shopifyClient from "@/services/shopify/client";

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  console.log("product", product);

  return <div>ProductPage</div>;
}

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

async function getProductBySlug(slug: string) {
  return await shopifyClient(getProductBySlugQuery, { slug });
}
