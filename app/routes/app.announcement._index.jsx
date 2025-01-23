import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/react";

import db from '../db.server';


// This is a get request
export async function loader({ request }) {
    try {
        const { session } = await authenticate.admin(request);
        console.log(session);

        const announcementData = await db.announcement.findFirst({
            where: {
                sessionId: session.id
            }
        })

        console.log(announcementData);

        return json(announcementData);

    } catch(error) {
        console.log("Loader error ", error);
    }
}


// This is a Component
export default function AnnouncementPage() {
    return (
        <Page>
            <h1>Announcement Page</h1>
        </Page>
    )
}