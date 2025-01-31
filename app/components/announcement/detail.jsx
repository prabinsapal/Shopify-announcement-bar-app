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

export default function AnnouncementDetail({ formData, showEditForm }) {
    return (
        <Card>
                                <BlockStack gap="400">
                                    <Text as="h2" variant="headingSm">
                                        Announcement Detail
                                    </Text>
        
                                    
                                        <Box>
                                            {/* <Text as="h3">
                                                Title
                                            </Text> */}
                                            <TextField 
                                                label="Title"
                                                disabled={!showEditForm}
                                                value={formData.title} 
                                                onChange={(title) => setFormData({ ...formData, title })} 
                                                autoComplete="off" />
                                                        
                                        </Box>
                                        <Box>
                                            <TextField
                                                type="text"
                                                label="Description"
                                                disabled={!showEditForm}
                                                value={formData.description}
                                                multiline={5}
                                                onChange={(description) => setFormData({ ...formData, description })}
                                            />
                                        </Box>
        
                                        <ButtonGroup>
                                            {showEditForm ? 
                                                <Button onClick={handleUpdate}>Save</Button>
                                                :
                                                <Button onClick={() => setEditForm(true)}>Edit</Button>
                                            }
                                            
        
                                            
                                        </ButtonGroup>
                                    </BlockStack>
        
                                </Card>
    )
}