import { Button, Card, InlineGrid, Page, Text, TextField } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";


export async function loader({ request }) {
    try {
        const { admin } = await authenticate.admin(request);

        const response = await admin.graphql(
            `#graphql
            query {
                products(first: 10) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                        }
                        cursor
                    }
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                        }
                }
            }`
        );

        const responseJson = await response.json();
        console.log(responseJson);
        const products = responseJson.data.products;

        let responseData = {
            products: products.edges,
            pageInfo: products.pageInfo
        };

        return json(responseData);
    } catch(error) {
        console.log("Loader error ", error);
        return {};
    }
}

export async function action({ request }) {
    try {
        const { admin, session } = await authenticate.admin(request);
        const { shop } = session;
        const requestMethod = request.method;

        if (requestMethod == "POST") {
            const data = {
                ...Object.fromEntries(await request.formData()),
                shop,
            }
            const response = await admin.graphql(
                `#graphql
                mutation setProduct($product: ProductCreateInput!) {
                    productCreate(product: $product) {
                        product {
                            id
                            title
                            options {
                                id
                                name
                                position
                                optionValues {
                                    id
                                    name
                                    hasVariants
                                }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }`,
                {
                    variables: {
                        product: {
                            title: data.name
                        }
                    }
                }
            );

            const responseJson = await response.json();
            console.log(responseJson);

            return json({});
        }
        return {};
    } catch(error) {
        console.log("Loader error ", error);
        return {};
    }
}

export default function GraphQlPage() {
    const productData = useLoaderData();
    const [productInput, setProductInput] = useState({});

    const submit = useSubmit();

    function handleCreate() {
        console.log("Save data to shopify");
        console.log(productInput);
        submit(productInput, { action: "/app/graphql", method: "POST"});
        shopify.toast.show("Data saved to Shopify");
    }

    return(
        <Page title="Graphql Page">
            <Card>
                <InlineGrid gap={300}>
                    <Text> Create New Product using GraphQl</Text>
                    <TextField
                        label="Product name"
                        value={productInput.name}
                        onChange={(value) => setProductInput({...productInput, name: value})}
                    />
                    <Button onClick={handleCreate}>Create product</Button>
                </InlineGrid>
            </Card>
            <Card>
                <Text>Product List</Text>
                
                {productData.products.map((product, index) => (
                    <div key={index}>
                        <Text variant="headingMd">{product.node.title}</Text>
                    </div>
                ))}
            </Card>
        </Page>
    )
}