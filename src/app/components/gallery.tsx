"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { Heading, VStack, Flex, Image, Text, Button } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebooksDisplay from "./notebooksDisplay";

const EmptyGallery = () => {
    const router = useRouter();

    return (
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
                There are no EDS Jupyter notebook around. Luckily you can fix
                that by uploading some!
            </Text>
            <Button
                colorScheme="blue"
                leftIcon={<AttachmentIcon />}
                onClick={() => {
                    router.push("/upload-book");
                }}
            >
                Upload now
            </Button>
        </Flex>
    );
};

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const hasNotebooks = notebooks.length > 0;
    return (
        <VStack align="center" direction="column" p={5} spacing={4}>
            <Heading>EDS Books Gallery</Heading>
            {hasNotebooks ? (
                <NotebooksDisplay notebooks={notebooks} />
            ) : (
                <EmptyGallery />
            )}
        </VStack>
    );
}
