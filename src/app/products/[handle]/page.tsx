import { getClient } from '@/lib/client';
import { notFound } from 'next/navigation';
import ProductView from '@/features/product/components/ProductView';
import { gql } from '@/gql';
import { GetProductAndRelatedQuery } from '@/gql/graphql';

const GET_PRODUCT_AND_RELATED = gql(`
  query GetProductAndRelated($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
    relatedProducts: products(first: 4, sortKey: RELEVANCE, query: "product_type:candle") {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`);

async function getProductAndRelated(handle: string) {
  const { data } = await getClient().query<GetProductAndRelatedQuery>({
    query: GET_PRODUCT_AND_RELATED,
    variables: { handle },
  });

  if (!data.product) {
    notFound();
  }

  const relatedProducts = data.relatedProducts.edges.map(({ node }) => ({
    id: node.id,
    variantId: node.variants.edges[0]?.node.id,
    href: `/products/${node.handle}`,
    imageUrl: node.images.edges[0]?.node.url || '/images/placeholders/product-1.png',
    name: node.title,
    price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
  }));

  return { product: data.product, relatedProducts };
}

export default async function ProductPage({ params: { handle } }: { params: { handle: string } }) {
  const { product, relatedProducts } = await getProductAndRelated(handle);
  return <ProductView product={product} relatedProducts={relatedProducts} />;
} 