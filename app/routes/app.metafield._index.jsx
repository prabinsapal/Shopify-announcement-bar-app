import { BlockStack, Button, Card, Page } from "@shopify/polaris";
import { useState } from "react";

export default function MetafieldPage() {
    const [selectedProduct, setSelectedProduct] = useState({});
    const [deeplinkUrl, setDeeplinkUrl] = useState("https://bs11-store.myshopify.com/admin/themes/current/editor?template=index&addAppBlockId=87e0d91a-e143-4a5f-ac88-a11f9640451e/app-block&target=mainSection");

    async function openProductSelector() {
        const selected = await shopify.resourcePicker({
            type: 'product',
            multiple: false,
        });

        console.log(selected);

        selected?.length > 0 && setSelectedProduct(selected);
    }

    // https://shopify.dev/docs/apps/build/custom-data
    // https://shopify.dev/docs/api/app-bridge-library/apis/resource-picker

    // Unstructed Metafield GraphQL

    // mutation {
    //     productUpdate(input: {
    //       id: "gid://shopify/Product/7307061690464",
    //       metafields: [
    //         {
    //           namespace: "custom",
    //           key: "dealer_unstructed",
    //           value: "Mercedez",
    //           type: "single_line_text_field",
    //         }
    //       ]
    //     }) {
    //       product {
    //         metafield(namespace: "custom", key: "dealer") {
    //           value
    //           type
    //         }
    //       }
    //     }
    //   }

    // Structed Metafield

    // mutation {
    //     metafieldDefinitionCreate(definition: {
    //       name: "Dealer name",
    //       namespace: "custom",
    //       key: "dealer",
    //       description: "Select your Product Dealer.",
    //       type: "single_line_text_field",
    //       ownerType: PRODUCT,
    //       access: {
    //         storefront: PUBLIC_READ,
    //       },
    //     }) {
    //       createdDefinition {
    //         name
    //         namespace
    //         key
    //       }
    //     }
    //   }

    //ProductList Graphql

    // query {
    //     products(first: 10) {
    //       edges {
    //         node {
    //           id
    //           title
    //           handle
    //           metafield(namespace: "custom", key: "dealer_unstructed") {
    //             id
    //             key
    //             value
    //           }
    //           metafields(keys: "custom.dealer", first: 10) {
    //             edges {
    //               node {
    //                 id
    //                 key
    //                 value
    //               }
    //             }
    //           }
    //         }
    //         cursor
    //       }
    //       pageInfo {
    //         hasNextPage
    //       }
    //     }
    //   }

    // App metadata ID
    // query {
    //     currentAppInstallation {
    //       id
    //     }
    //   }

    // Create APp MetaData
    // mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
    //     metafieldsSet(metafields: $metafieldsSetInput) {
    //       metafields {
    //         id
    //         namespace
    //         key
    //         value
    //       }
    //       userErrors {
    //         field
    //         message
    //       }
    //     }
    //   }

    return(
        <Page title="MetaField Page">
            <Card>
                <BlockStack gap={200} inlineAlign="start">
                    <Button url={deeplinkUrl} variant="primary" target="_">Install app</Button>
                    <Button onClick={openProductSelector}>Select Product</Button>
                </BlockStack>
            </Card>
        </Page>
    )
    
    
}