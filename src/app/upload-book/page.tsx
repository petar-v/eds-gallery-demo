import { Metadata } from "next";

import { Box, Heading, Flex } from "@chakra-ui/react";
import FileUploadDialog from "./fileUploadDialog";

import { FileType } from "@/definitions/FileType";
import { addNotebook } from "@/lib/storage";

export const metadata: Metadata = {
    title: "Upload a new EDS Book",
    description: "Upload a new EDS Book",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
    async function upload(files: FileType[]) {
        "use server";
        console.log(files.map((file) => file.name));
        files.filter(file => file.data !== null).forEach((file) => { 
            addNotebook({
                title: file.name,
                data: file.data || ""
            });
        });

        await sleep(4000);

        return { success: true };
    }
    return (
        <main>
            <Flex
                align="center"
                justify="center"
                h="100vh"
                direction="column"
                bg="gray.100"
                grow={1}
                mt={0}
            >
                <Heading mb={6} h={10}>
                    Upload a Jupyter Notebook
                </Heading>
                <Box maxW="lg" w="full" bg="white" boxShadow="lg" rounded="md">
                    <FileUploadDialog upload={upload} />
                </Box>
            </Flex>
        </main>
    );
}
