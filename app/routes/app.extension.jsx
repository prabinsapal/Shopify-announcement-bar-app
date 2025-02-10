import { json } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import db from '../db.server';

export async function loader({ request }) {
    try {
        console.log(request);
        const { session } = await authenticate.public.appProxy(request);
        const announcementData = await db.announcement.findFirst({
            where: {
                sessionId: session.id
            },
            select: {
                "id": true,
                "title": true,
                "description": true
            }
        })

        console.log(announcementData);
        if (!announcementData) {
            announcementData = {};
        }

        return json(announcementData);
    } catch(error) {
        console.log("API Error: ", error);
        return json({
            "data": "invalid"
        });
    }
}