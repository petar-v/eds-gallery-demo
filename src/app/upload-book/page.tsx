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
    ): Promise<{ success: boolean; error?: string }> {
        "use server";
        try {
            await addNotebook(notebook);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: "The notebook could not be saved to the database.",
            };
        }
    }

    return (
        <main>
            <Box py={5}>
                <VStack align="center" spacing={2}>
                    <Heading>Upload a Jupyter Notebook</Heading>
                    {process.env.APP_ROOT}
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
                </VStack>
            </Box>
        </main>
    );
}
