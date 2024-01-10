"use client";

import React, { useState } from "react";

import NextLink from "next/link";
import { Link } from "@chakra-ui/next-js";

import { Text, Spinner, VStack, useToast, Button } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import FileUploader from "./components/fileUploader";
import NotebookDetailsEdit from "./components/notebookDetailsEdit";

import { FileType } from "@/definitions/FileType";
import Notebook from "@/definitions/Notebook";
import { parseFileEncodedNotebook } from "@/lib/notebooks";
import SuccessMessage from "./components/successMessage";
import { notebookToUrl } from "@/lib/nav";

export type UploadFunctionType = (
    notebook: Notebook,
) => Promise<{ success: boolean; error?: string; id?: number }>;

export default function FileUploadDialog({
    upload,
}: {
    upload: UploadFunctionType;
}) {
    const [notebook, setNotebook] = useState<Notebook>();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>();

    const toast = useToast();

    const onSubmit = (notebook: Notebook) =>
        upload(notebook).then(({ success, error, id }) => {
            if (success) {
                setSuccess(true);
                setNotebook({
                    ...notebook,
                    id,
                });
            } else {
                setError(error);
            }
        });

    const handleRefresh = () => {
        setNotebook(undefined);
        setIsLoading(false);
        setSuccess(false);
        setError(undefined);
    };

    if (error) {
        return (
            <SuccessMessage
                status={"error"}
                title="Upload failed!"
                description={`The files were not uploaded successfully. ${error}`}
                againLabel={"Retry"}
                onRefresh={handleRefresh}
            />
        );
    }
    if (success) {
        const extraButtons = notebook?.id && (
            <NextLink href={notebookToUrl(notebook)}>
                <Button
                    w="100%"
                    colorScheme="teal"
                    leftIcon={<ExternalLinkIcon />}
                >
                    View
                </Button>
            </NextLink>
        );
        return (
            <SuccessMessage
                status={"success"}
                title="Upload successful!"
                description={
                    <Text>
                        The files you uploaded have been stored successfully and
                        are now in the{" "}
                        <Link
                            as={NextLink}
                            href="/"
                            textDecoration={"underline"}
                        >
                            Gallery.
                        </Link>
                    </Text>
                }
                againLabel={"Upload another"}
                onRefresh={handleRefresh}
                extraButtons={extraButtons}
            />
        );
    }
    if (isLoading) {
        return (
            <VStack align="center" py={8}>
                <Spinner
                    color="purple"
                    emptyColor="gray.200"
                    size="xl"
                    speed="0.65s"
                    thickness="5px"
                />
                <p>Processing notebook...</p>
            </VStack>
        );
    }
    if (!notebook) {
        const toastErrorMessage = ({
            title,
            description,
        }: {
            title: string;
            description: string;
        }) =>
            toast({
                title,
                description,
                position: "top",
                status: "error",
                duration: 9000,
                isClosable: true,
            });

        return (
            <FileUploader
                maxSize={10 * 1000 * 1000}
                fileType="jupyter"
                primaryColor={"red.400"}
                secondaryColor={"gray.100"}
                backgroundColor={"white"}
                showOver={true}
                onUploadStart={() => {
                    setIsLoading(true);
                }}
                onUploadEnd={(uploadedFiles: FileType[]) => {
                    console.log("uploaded", uploadedFiles);

                    if (uploadedFiles.length > 0) {
                        const uploadedFile = uploadedFiles[0];
                        // TODO: try parsing the files one by one until we find a proper jupyter notebook
                        parseFileEncodedNotebook(uploadedFile.data || "")
                            .then(setNotebook)
                            .catch(() => {
                                toastErrorMessage({
                                    title: "Unrecognized file type.",
                                    description: `The file ${uploadedFile.name} is not a Jupyter Notebook or something we can handle.`,
                                });
                            });
                    } else {
                        toastErrorMessage({
                            title: "Unrecognized files.",
                            description: `It seems the files failed to upload. Please try again later.`,
                        });
                    }
                    setIsLoading(false);
                }}
            />
        );
    }

    return (
        <NotebookDetailsEdit
            notebook={notebook}
            onReset={() => {
                setNotebook(undefined);
            }}
            onSubmit={onSubmit}
        />
    );
}
