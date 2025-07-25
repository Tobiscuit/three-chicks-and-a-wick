import { getClient } from '@/lib/client';
import { gql } from '@apollo/client';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';

const GET_PRODUCT_AND_RELATED_QUERY = gql`
  query GetProductAndRelated($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
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
`;

async function getProductAndRelated(handle: string) {
  const { data } = await getClient().query({
    query: GET_PRODUCT_AND_RELATED_QUERY,
    variables: { handle },
  });

  if (!data.product) {
    notFound();
  }

  const relatedProducts = data.relatedProducts.edges.map((edge: { node: any }) => ({
    id: edge.node.id,
    variantId: edge.node.variants.edges[0]?.node.id,
    href: `/products/${edge.node.handle}`,
    imageUrl: edge.node.images.edges[0]?.node.url || '/images/placeholders/product-1.png',
    name: edge.node.title,
    price: `$${parseFloat(edge.node.priceRange.minVariantPrice.amount).toFixed(2)}`,
  }));

  return { product: data.product, relatedProducts };
}

export default async function ProductPage({ params: { handle } }: { params: { handle: string } }) {
  const { product, relatedProducts } = await getProductAndRelated(handle);
  return <ProductView product={product} relatedProducts={relatedProducts} />;
} 