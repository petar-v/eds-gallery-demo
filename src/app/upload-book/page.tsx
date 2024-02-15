import React from "react";

import { Metadata } from "next";

import { Box, Heading } from "@chakra-ui/react";
import FileUploadDialog, { UploadFunctionType } from "./fileUploadDialog";

import { addNotebook } from "@/lib/storage";
import { purgeNotebookRouteCache } from "@/lib/nav";

export const metadata: Metadata = {
    title: "Upload a new EDS Book",
    description: "Upload a new EDS Book",
};

const upload: UploadFunctionType = async (notebook) => {
    "use server";
    try {
        const id = await addNotebook(notebook);
        console.log(`Added a new notebook with ID ${id}`);

        // purge cache in gallery so the new notebook will appear
        purgeNotebookRouteCache();

        return { success: true, id };
    } catch (err) {
        return {
            success: false,
            error: "The notebook could not be saved to the database.",
        };
    }
};

const Page = () => (
    <>
        <header>
            <Heading>Upload a Jupyter Notebook</Heading>
        </header>
        <main>
            <Box w="full" maxW="lg" p={5} bg="white" shadow="lg" rounded="md">
                <FileUploadDialog upload={upload} />
            </Box>
        </main>
    </>
);

export default Page;
