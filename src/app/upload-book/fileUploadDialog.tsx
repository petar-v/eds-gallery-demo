"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Spinner,
    VStack,
    useToast,
    Link,
    Button,
    ButtonGroup,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";

import FileUploader from "./components/fileUploader";
import NotebookDetailsEdit from "./components/notebookDetailsEdit";

import { FileType } from "@/definitions/FileType";
import Notebook from "@/definitions/Notebook";
import { parseFileEncodedNotebook } from "@/lib/notebooks";

export default function FileUploadDialog({
    upload,
}: {
    upload: (
        notebook: Notebook,
    ) => Promise<{ success: boolean; error?: string }>;
}) {
    const [notebook, setNotebook] = useState<Notebook>();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>();

    const toast = useToast();
    const router = useRouter();

    const onSubmit = (notebook: Notebook) =>
        upload(notebook).then(({ success, error }) => {
            if (success) setSuccess(true);
            else setError(error);
        });

    const handleRefresh = () => {
        setNotebook(undefined);
        setIsLoading(false);
        setSuccess(false);
        setError(undefined);
        router.refresh();
    };
    if (error) {
        return (
            <VStack align="center" justify="center">
                <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Upload failed!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        The files were not uploaded successfully. {error}
                    </AlertDescription>
                </Alert>
                <ButtonGroup w="100%">
                    <Button
                        onClick={handleRefresh}
                        border="2px"
                        w="100%"
                        leftIcon={<RepeatClockIcon />}
                    >
                        Retry
                    </Button>
                </ButtonGroup>
            </VStack>
        );
    }
    if (success) {
        return (
            <VStack align="center" justify="center">
                <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Upload successful!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        The files you uploaded have been stored successfully and
                        are now in the{" "}
                        <Link as={NextLink} href="/">
                            Gallery.
                        </Link>
                    </AlertDescription>
                </Alert>
                <ButtonGroup w="100%">
                    <Button
                        onClick={handleRefresh}
                        border="2px"
                        w="100%"
                        borderColor="green.500"
                        leftIcon={<RepeatClockIcon />}
                    >
                        Upload another
                    </Button>
                </ButtonGroup>
            </VStack>
        );
    }
    if (isLoading) {
        return (
            <VStack py={8} align="center">
                <Spinner
                    thickness="5px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="purple"
                    size="xl"
                />
                <p>Processing notebook...</p>
            </VStack>
        );
    }
    if (!notebook) {
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
                onUploadEnd={async (uploadedFiles: FileType[]) => {
                    console.log("uploaded", uploadedFiles);
                    if (uploadedFiles.length > 0) {
                        // try parsing the files one by one until we find a proper jupyter notebook
                        for (const uploadedFile of uploadedFiles) {
                            try {
                                const notebook = await parseFileEncodedNotebook(
                                    uploadedFile.data || "",
                                );
                                setNotebook(notebook);
                                break;
                            } catch (err) {
                                toast({
                                    title: "Unrecognized file type.",
                                    description: `The file ${uploadedFile.name} is not a Jupyter Notebook or something we can handle.`,
                                    position: "top",
                                    status: "error",
                                    duration: 9000,
                                    isClosable: true,
                                });
                                continue;
                            }
                        }
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
