"use client";

import React, { RefObject, useRef, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

import {
    Flex,
    Container,
    Heading,
    Box,
    Text,
    Button,
    StackDivider,
    VStack,
    useToast,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ToastProps,
} from "@chakra-ui/react";
import {
    HamburgerIcon,
    InfoIcon,
    DeleteIcon,
    WarningIcon,
} from "@chakra-ui/icons";

import Notebook from "@/definitions/Notebook";

import TableOfContents from "./tableOfContents";
import ColorfulTag from "@/components/ColorfulTag";

import Ipynb from "./Ipynb";
import { galleryRoute } from "@/lib/nav";

export type DeleteNotebookFunctionType = (id: number | undefined) => Promise<{
    success: boolean;
    error?: string;
}>;

const NotebookDeleteButton = ({
    notebook,
    deleteNotebook,
    children,
}: PropsWithChildren & {
    notebook: Notebook;
    deleteNotebook: () => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button
                w="full"
                colorScheme="red"
                leftIcon={<DeleteIcon />}
                onClick={onOpen}
            >
                {children}
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete this notebook?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Are you sure you want to delete{" "}
                            <Text as="b">{notebook.title}</Text>?
                        </Text>
                        <Text>
                            This will delete the notebook from the gallery and
                            it will not be accessible by anyone anymore.
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            leftIcon={<WarningIcon />}
                            onClick={() => {
                                deleteNotebook();
                                onClose();
                            }}
                        >
                            Delete for everyone
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const NotebookActions = ({
    notebook,
    notebookRef,
    deleteNotebook,
}: {
    notebook: Notebook;
    notebookRef: RefObject<HTMLElement>;
    deleteNotebook: () => void;
}) => {
    const divider = <StackDivider borderColor="gray.300" />;
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

    const toast = useToast();
    const router = useRouter();

    const redirectToGallery = () => router.replace(galleryRoute);

    const errorToast = (message: string): ToastProps => ({
        title: "Error when deleting this notebook",
        description: `${message} Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true,
    });

    const executeDeleteNotebook = () => {
        const deletePromise = deleteNotebook(notebook.id);
        toast.promise(deletePromise, {
            success: ({
                success,
                error,
            }: {
                success: boolean;
                error?: string;
            }) => {
                if (success) {
                    return {
                        title: "This notebook was deleted",
                        description: `You have successfully deleted this notebook. You will be redirected to the Gallery shortly`,
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                        onCloseComplete: redirectToGallery,
                    };
                }
                return errorToast(error || "Unknown issue.");
            },
            error: (error) => errorToast(error.message),
            loading: {
                title: "Deleting notebook",
                description: "Please wait...",
            },
        });
    };

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
                    deleteNotebook={executeDeleteNotebook}
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
