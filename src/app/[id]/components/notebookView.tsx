"use client";

import React, { RefObject, useRef, PropsWithChildren } from "react";

import {
    Flex,
    Container,
    Heading,
    Box,
    Button,
    StackDivider,
    VStack,
} from "@chakra-ui/react";
import {
    HamburgerIcon,
    InfoIcon,
    DeleteIcon,
    SettingsIcon,
} from "@chakra-ui/icons";

import Notebook, { NotebookMetadata } from "@/definitions/Notebook";

import TableOfContents from "./tableOfContents";
import ColorfulTag from "@/components/ColorfulTag";

import Ipynb from "./Ipynb";

export type DeleteNotebookFunctionType = (
    notebook: NotebookMetadata,
) => Promise<{ success: boolean; error?: string }>;

const NotebookDeleteButton = ({
    notebook,
    deleteNotebook,
    children,
}: PropsWithChildren & {
    notebook: Notebook;
    deleteNotebook: DeleteNotebookFunctionType;
}) => {
    return (
        <Button
            w="full"
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={() => {
                deleteNotebook(notebook)
                    .then(({ success }) => {
                        alert(success);
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }}
        >
            {children}
        </Button>
    );
};

const NotebookActions = ({
    notebook,
    notebookRef,
    deleteNotebook,
}: {
    notebook: Notebook;
    notebookRef: RefObject<HTMLElement>;
    deleteNotebook: DeleteNotebookFunctionType;
}) => {
    const divider = <StackDivider borderColor="gray.200" />;
    return (
        <VStack align="stretch" divider={divider} spacing={4}>
            {divider}
            <Container>
                <Heading noOfLines={1} size="sm">
                    <HamburgerIcon mr={1} />
                    Contents
                </Heading>
                <nav>
                    <TableOfContents
                        source={notebookRef}
                        // maxDepth={3}
                        insertIDs={true}
                    />
                </nav>
            </Container>
            <Container>
                <Heading noOfLines={1} size="sm">
                    <InfoIcon mr={1} />
                    Notebook Information
                </Heading>
                {notebook.author && (
                    <Box mb={4} fontSize="sm">
                        Author: {notebook.author}
                    </Box>
                )}
                {notebook.tags.length > 0 && (
                    <Flex wrap="wrap" direction="row" gap={2}>
                        {notebook.tags.map((tag, i) => (
                            <ColorfulTag size="md" tag={tag} key={`tag-${i}`} />
                        ))}
                    </Flex>
                )}
            </Container>
            <Container>
                {/* <Heading noOfLines={1} size="sm">
                    <SettingsIcon mr={1} />
                    Notebook Actions
                </Heading> */}
                <NotebookDeleteButton
                    deleteNotebook={deleteNotebook}
                    notebook={notebook}
                >
                    Delete Notebook
                </NotebookDeleteButton>
            </Container>
        </VStack>
    );
};

export default function NotebookView({
    notebook,
    deleteNotebook,
}: {
    notebook: Notebook;
    deleteNotebook: DeleteNotebookFunctionType;
}) {
    const notebookRef = useRef<HTMLDivElement>(null);

    return (
        <Flex direction={{ base: "column", md: "row" }} maxW="100%" px={4}>
            <Box
                flex="0 0 20%"
                maxW={{ base: "100%", md: "20%" }}
                mb={5}
                pt={1}
            >
                {/* TODO: hide sidebar when md or smaller */}
                <NotebookActions
                    notebook={notebook}
                    notebookRef={notebookRef}
                    deleteNotebook={deleteNotebook}
                />
            </Box>
            <Box flex="0 1 80%" maxW={{ base: "100%", md: "80%" }} pr={3}>
                <article>
                    <Ipynb ref={notebookRef} ipynb={notebook.data} />
                </article>
            </Box>
        </Flex>
    );
}
