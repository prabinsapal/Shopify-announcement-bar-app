import { useFetcher } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { Button, Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";


export async function action({ request }) {
    const { admin } = await authenticate.admin(request);
      
      const response = await admin.graphql(
        `#graphql
          mutation populateProduct($product: ProductCreateInput!) {
            productCreate(product: $product) {
              product {
                id
                title
                handle
                status
                variants(first: 10) {
                  edges {
                    node {
                      id
                      price
                      barcode
                      createdAt
                    }
                  }
                }
              }
            }
          }`,
        {
          variables: {
            product: {
              title: `Snowboard`,
            },
          },
        },
      );
      const responseJson = await response.json();
      console.log("--------------------------");
      console.log(responseJson);
      const product = responseJson.data.productCreate.product;

      return {
        product: product
      };

    //   const variantId = product.variants.edges[0].node.id;
    //   const variantResponse = await admin.graphql(
    //     `#graphql
    //     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    //       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    //         productVariants {
    //           id
    //           price
    //           barcode
    //           createdAt
    //         }
    //       }
    //     }`,
    //     {
    //       variables: {
    //         productId: product.id,
    //         variants: [{ id: variantId, price: "100.00" }],
    //       },
    //     },
    //   );
    //   const variantResponseJson = await variantResponse.json();
    
    //   return {
    //     product: responseJson.data.productCreate.product,
    //     variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
    //   };
    
}

export default function ProductGraphQl() {
    const fetcher = useFetcher();

    function generateProduct() {
        console.log(" generate product ---");
        fetcher.submit({}, { method: "POST" });
    };

    return (
        <Page>
            <TitleBar title="Remix app template">
                    
                  </TitleBar>

                  <Button onClick={generateProduct}>
                    Create Product
                  </Button>
        </Page>

    );
}