"use client";

import React from "react";

import {
    Heading,
    VStack,
    Flex,
    Image,
    Text,
    Button,
    Link,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebooksDisplay from "./notebooksDisplay";
import { uploadNotebookRoute } from "@/lib/nav";

const EmptyGallery = () => (
    <Flex align="center" direction="column">
        <Image
            boxSize="500px"
            maxW="lg"
            objectFit="cover"
            alt="No notebooks here."
            src="/no-results.svg"
        />
        <Heading>Oh no! No Notebooks here yet...</Heading>
        <Text>
            There are no EDS Jupyter notebooks around. Luckily you can fix that
            by uploading some!
        </Text>
        <Link href={uploadNotebookRoute}>
            <Button colorScheme="blue" leftIcon={<AttachmentIcon />}>
                Upload now
            </Button>
        </Link>
    </Flex>
);

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const hasNotebooks = notebooks.length > 0;
    return (
        <VStack align="center" direction="column" p={5} spacing={4}>
            {hasNotebooks ? (
                <NotebooksDisplay notebooks={notebooks} />
            ) : (
                <EmptyGallery />
            )}
        </VStack>
    );
}
