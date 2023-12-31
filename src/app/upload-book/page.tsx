import { Metadata } from "next";

import { Box, Heading, VStack } from "@chakra-ui/react";
import FileUploadDialog from "./fileUploadDialog";

import Notebook from "@/definitions/Notebook";
import { addNotebook } from "@/lib/storage";

export const metadata: Metadata = {
    title: "Upload a new EDS Book",
    description: "Upload a new EDS Book",
};

export default function Page() {
    async function upload(
        notebook: Notebook,
    ): Promise<{ success: boolean; error?: string; id?: number }> {
        "use server";
        try {
            const id = await addNotebook(notebook);
            console.log(`Added a new notebook with ID ${id}`);
            return { success: true, id };
        } catch (err) {
            return {
                success: false,
                error: "The notebook could not be saved to the database.",
            };
        }
    }

    return (
        <>
            <header>
                <Heading>Upload a Jupyter Notebook</Heading>
            </header>
            <main>
                <Box
                    w="full"
                    maxW="lg"
                    p={5}
                    bg="white"
                    shadow="lg"
                    rounded="md"
                >
                    <FileUploadDialog upload={upload} />
                </Box>
            </main>
        </>
    );
}
