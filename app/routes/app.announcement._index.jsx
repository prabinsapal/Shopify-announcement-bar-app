import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  LegacyCard,
  EmptyState,
  FormLayout,
  TextField,
  ButtonGroup,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { json, useLoaderData, useSubmit } from "@remix-run/react";

import db from "../db.server";
import { useEffect, useState } from "react";

// This is a get request
export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);

    var announcementData = await db.announcement.findFirst({
      where: {
        sessionId: session.id,
      },
    });

    return json(announcementData || {});
  } catch (error) {
    console.log("Loader error ", error);
  }
}

// This is a post/put/delete request
export async function action({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    const requestMethod = request.method;
    const formData = Object.fromEntries(await request.formData());

    if (requestMethod === "POST") {
      if (!formData.title || !formData.description) {
        return json(
          { message: "Title and description are required." },
          { status: 422 },
        );
      }

      const savedData = await db.announcement.create({
        data: {
          title: formData.title,
          description: formData.description,
          sessionId: session.id,
        },
      });

      return json({ message: "Data Saved", data: savedData }, { status: 200 });
    }

    if (requestMethod === "PUT") {
      if (!formData.title || !formData.description) {
        return json(
          { message: "Title and description are required." },
          { status: 422 },
        );
      }

      const updatedData = await db.announcement.update({
        where: { sessionId: session.id },
        data: {
          title: formData.title,
          description: formData.description,
        },
      });

      return json(
        { message: "Data Updated", data: updatedData },
        { status: 200 },
      );
    }

    if (requestMethod === "DELETE") {
      await db.announcement.delete({
        where: { sessionId: session.id },
      });

      return json({ message: "Data Deleted" }, { status: 200 });
    }
  } catch (error) {
    return json({ message: "API error" }, { status: 500 });
  }
}

// This is a Component
export default function AnnouncementPage() {
  const announcementData = useLoaderData();
  const [dataAvailable, setDataAvailable] = useState(false);
  const [showCreateForm, setCreateForm] = useState(false);
  const [formData, setFormData] = useState(announcementData);
  const [isEditing, setIsEditing] = useState(false);

  const submit = useSubmit();

  function handleSave() {
    try {
      submit(formData, { action: "/app/announcement", method: "POST" });
      shopify.toast.show("Data Saved to database");
    } catch (error) {
      console.log("API Error ", error);
      shopify.toast.show("API Error");
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleUpdate() {
    try {
      submit(formData, { action: "/app/announcement", method: "PUT" });
      shopify.toast.show("Data Updated");
      setIsEditing(false);
    } catch (error) {
      console.log("API Error ", error);
      shopify.toast.show("API Error");
    }
  }

  function handleDelete() {
    try {
      submit(formData, { action: "/app/announcement", method: "DELETE" });
      shopify.toast.show("Data Deleted");
    } catch (error) {
      console.log("API Error ", error);
      shopify.toast.show("API Error");
    }
  }

  useEffect(() => {
    setDataAvailable(Object.keys(announcementData).length !== 0);
  }, [announcementData]);

  return (
    <Page
      title="Announcement"
      primaryAction={{ content: "Create", onAction: () => setCreateForm(true) }}
    >
      {dataAvailable ? (
        <>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingSm">
                Announcement Detail
              </Text>

              {isEditing ? (
                <FormLayout>
                  <TextField
                    label="Title"
                    value={formData.title}
                    onChange={(title) => setFormData({ ...formData, title })}
                    autoComplete="off"
                  />
                  <TextField
                    type="text"
                    label="Description"
                    value={formData.description}
                    multiline={5}
                    onChange={(description) =>
                      setFormData({ ...formData, description })
                    }
                  />
                  <ButtonGroup>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdate}>
                      Update
                    </Button>
                  </ButtonGroup>
                </FormLayout>
              ) : (
                <>
                  <Box>
                    <Text as="h3">Title</Text>
                    <Text as="p">{formData.title}</Text>
                  </Box>
                  <Box>
                    <Text as="h3">Description</Text>
                    <Text as="p">{formData.description}</Text>
                  </Box>
                  <ButtonGroup>
                    <Button onClick={handleEdit}>Edit</Button>
                    <Button onClick={handleDelete} variant="destructive">
                      Delete
                    </Button>
                  </ButtonGroup>
                </>
              )}
            </BlockStack>
          </Card>
        </>
      ) : (
        <>
          {showCreateForm ? (
            <>
              <Card>
                <FormLayout>
                  <TextField
                    label="Title"
                    value={formData.title}
                    onChange={(title) => setFormData({ ...formData, title })}
                    autoComplete="off"
                  />
                  <TextField
                    type="text"
                    label="Description"
                    value={formData.description}
                    multiline={5}
                    onChange={(description) =>
                      setFormData({ ...formData, description })
                    }
                  />

                  <ButtonGroup>
                    <Button onClick={() => setCreateForm(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                      Save
                    </Button>
                  </ButtonGroup>
                </FormLayout>
              </Card>
            </>
          ) : (
            <LegacyCard sectioned>
              <EmptyState
                heading="Announcement is not Available. Create one"
                action={{ content: "Create new" }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              />
            </LegacyCard>
          )}
        </>
      )}
    </Page>
  );
}
