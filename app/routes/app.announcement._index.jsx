import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
    LegacyCard,
    EmptyState,
    FormLayout,
    TextField,
    ButtonGroup,
    Button
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json, useLoaderData, useSubmit } from "@remix-run/react";

import db from '../db.server';
import { useEffect, useState } from "react";
import AnnouncementDetail from "../components/announcement/detail";


// This is a get request
export async function loader({ request }) {
    try {
        const { session } = await authenticate.admin(request);

        var announcementData = await db.announcement.findFirst({
            where: {
                sessionId: session.id
            }
        })

        if (!announcementData) {
            announcementData = {};
        }

        console.log(announcementData);

        return json(announcementData);

    } catch(error) {
        console.log("Loader error ", error);
    }
}

// This is post/put/delete request
export async function action({ request, params }) {
    try {
        const { session } = await authenticate.admin(request);
        const { shop } = session;
        const requestMethod = request.method;

        if (requestMethod == "POST") {
            const data = {
                ...Object.fromEntries(await request.formData()),
                shop,
            }

            console.log("data ----- ", data);

            if (!data.title || !data.description) {
                return json({ message: "Title and description is required."}, { status: 422});
            }

            const savedData = await db.announcement.create({
                data: {
                    title: data.title,
                    description: data.description,
                    sessionId: session.id
                }
            })

            return json({ message: "Data Saved", data: savedData}, {status: 200});
        }
        else if(requestMethod == "PUT") {
            const data = {
                ...Object.fromEntries(await request.formData()),
                shop,
            }

            console.log("data ----- ", data);

            if (!data.title || !data.description) {
                return json({ message: "Title and description is required."}, { status: 422});
            }

            const savedData = await db.announcement.update({
                where: {
                    id: data.id
                },
                data: {
                    title: data.title,
                    description: data.description
                }
            })

            return json({ message: "Data Updated", data: savedData}, {status: 200});
        }

        
    } catch(error) {
        return json({ message: "API error"}, {status : 500})
    }
    
}


// This is a Component
export default function AnnouncementPage() {
    const announcementData = useLoaderData();
    const [dataAvailable, setDataAvailable] = useState(false);
    const [showCreateForm, setCreateForm] = useState(false);
    const [formData, setFormData] = useState(announcementData);
    const [showEditForm, setEditForm] = useState(false);

    const submit = useSubmit();

    function handleSave() {
        try {
            console.log(" handle save ");
            submit(formData, { action: "/app/announcement", method: "POST"})
            shopify.toast.show("Data Saved to database")
        } catch(error) {
            console.log("API Error ", error)
            shopify.toast.show("API Error");
        }
    }

    function handleUpdate()
    {
        try {
            console.log(" handle update ");
            submit(formData, { action: "/app/announcement", method: "PUT"})
            shopify.toast.show("Data Updated to database")
        } catch(error) {
            console.log("API Error ", error)
            shopify.toast.show("API Error");
        }
    }

    
    useEffect(() => {
        if (Object.keys(announcementData).length !== 0) {
            console.log("Data is not empty")
            setDataAvailable(true);
            
        }
        console.log(" ========== ", dataAvailable);
    }, [announcementData])

    return (
        <Page 
            title="Announcement"
            primaryAction={{ content: "Create", 
                            onAction: () => setCreateForm(true) }}
            // secondaryActions={[
            //     {
            //       content: 'Duplicate',
            //       accessibilityLabel: 'Secondary action label',
            //       onAction: () => alert('Duplicate action'),
            //     },
            //     {
            //       content: 'View on your store',
            //       onAction: () => alert('View on your store action'),
            //     },
            //   ]}
        
            >
                {
                    dataAvailable ?
                    <>
                        <AnnouncementDetail formData={formData} showEditForm={showEditForm} />
                    </>
                    :
                    <>
                        {showCreateForm ?
                        <>
                            <Card>
                            <FormLayout>
                                <TextField 
                                    label="Title"
                                    value={formData.title} 
                                    onChange={(title) => setFormData({ ...formData, title })} 
                                    autoComplete="off" />
                                <TextField
                                    type="text"
                                    label="Description"
                                    value={formData.description}
                                    multiline={5}
                                    onChange={(description) => setFormData({ ...formData, description })}
                                />

                                <ButtonGroup>
                                    <Button onClick={() => setFormData({})}>Cancel</Button>
                                    <Button variant="primary" 
                                            onClick={handleSave}
                                            >Save</Button>
                                </ButtonGroup>
                                </FormLayout>

                                {/* <ui-modal id="my-modal">
                                    <p>Message</p>
                                    <ui-title-bar title="Title">
                                        <button variant="primary">Label</button>
                                        <button onclick="document.getElementById('my-modal').hide()">Label</button>
                                    </ui-title-bar>
                                </ui-modal> */}


                            </Card>
                        </>
                        :
                        <LegacyCard sectioned>
                            <EmptyState
                                heading="Announcement is not Available. Create one"
                                action={{content: 'Create new'}}
                                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            >
                                {/* <p>Track and receive your incoming inventory from suppliers.</p> */}
                            </EmptyState>
                        </LegacyCard>
                        }
                    </>
                }
        </Page>
    )
}