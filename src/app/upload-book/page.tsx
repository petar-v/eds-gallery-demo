import { Metadata } from "next";

import { Box, Heading, Flex } from "@chakra-ui/react";
import FileUploadDialog from "./fileUploadDialog";

import { writeFile } from 'fs/promises';
import { join } from 'path';

export const metadata: Metadata = {
    title: "Upload a new EDS Book",
    description: "Upload a new EDS Book",
};

export default function Page() {
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
                    <FileUploadDialog />
                </Box>
            </Flex>
        </main>
    );
}
