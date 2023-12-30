import { Metadata } from "next";

import { Box, Heading, VStack } from "@chakra-ui/react";
import FileUploadDialog from "./fileUploadDialog";

import { FileType } from "@/definitions/FileType";
import { addNotebook } from "@/lib/storage";
import { parseFileEncodedNotebook } from "@/lib/notebooks";
import Notebook from "@/definitions/Notebook";

export const metadata: Metadata = {
    title: "Upload a new EDS Book",
    description: "Upload a new EDS Book",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
    async function upload(files: FileType[]) {
        "use server";
        console.log(files.map((file) => file.name));

        // TODO: add in parallel
        files
            .filter((file) => file.data !== null)
            .forEach(async (file) => {
                try {
                    const notebook = await parseFileEncodedNotebook(
                        file.data || "",
                    );
                    await addNotebook(notebook);
                } catch (err) {
                    // console.error("Failed to parse notebook " + file.name, err);
                }
            });
        // TODO: error handling
        return { success: true };
    }

    async function mockUpload(notebook: Notebook) {
        "use server";
        console.log("New notebook", notebook.title, notebook.tags.join(", "));
        return { success: true, error: "" };
    }

    return (
        <main>
            <Box py={5}>
                <VStack align="center" spacing={2}>
                    <Heading>Upload a Jupyter Notebook</Heading>
                    <Box
                        maxW="lg"
                        w="full"
                        bg="white"
                        boxShadow="lg"
                        rounded="md"
                        p={5}
                    >
                        <FileUploadDialog upload={mockUpload} />
                    </Box>
                </VStack>
            </Box>
        </main>
    );
}
