"use client";

import { useState } from "react";

import FileUploader from "./components/fileUploader";
import { FileType } from "@/definitions/FileType";

import {
    UnorderedList,
    ListItem,
    Box,
    Heading,
    Button,
    useToast
} from "@chakra-ui/react";

export default function FileUploadDialog({
    upload,
}: {
    upload: (files: FileType[]) => Promise<{ success: boolean}>;
}) {
    const [files, setFiles] = useState<FileType[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const toast = useToast();
    
    return (
        <Box p={5}>
            <FileUploader
                maxSize={10 * 1000000}
                fileType="jupyter"
                primaryColor={"red.400"}
                secondaryColor={"gray.100"}
                backgroundColor={"white"}
                showOver={true}
                onUploadStart={() => {
                    console.log("upload start");
                }}
                onUploadEnd={(uploadedFiles: FileType[]) => {
                    console.log("upload end", files);
                    uploadedFiles.forEach((file) => {
                        files.push(file);
                        setFiles([...files]);
                    });
                }}
            />
            {files.length > 0 && (
                <>
                    <Box m={5}>
                        <Heading size="xs">Files to upload</Heading>
                        <UnorderedList>
                            {files.map((file, i) => {
                                return <ListItem key={i}>{file.name}</ListItem>;
                            })}
                        </UnorderedList>
                    </Box>
                    <Box>
                        <Button
                            colorScheme="purple"
                            w="100%"
                            onClick={() => {
                                console.log(
                                    `Uploading ${files.length} to server.`,
                                );
                                setIsUploading(true);
                                upload(files).then((resp) => {
                                    console.log(`Upload success: ${resp.success}`);
                                    setFiles([]);
                                    toast({
                                        title: 'Upload successful.',
                                        description: "The files you uploaded have been stored successfully and are now in the Gallery.",
                                        position: "top",
                                        status: 'success',
                                        duration: 9000,
                                        isClosable: true,
                                    });
                                }).finally(() => {
                                    setIsUploading(false);
                                });
                            }}
                            loadingText='Uploading'
                            isLoading={isUploading}
                            isDisabled={isUploading}
                        >
                            Upload
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
