"use client";

import { useState } from "react";

import { Box } from "@chakra-ui/react";

import FileUploader from "./components/fileUploader";
import NotebookDetailsEdit from "./components/notebookDetailsEdit";

import { FileType } from "@/definitions/FileType";
import Notebook from "@/definitions/Notebook";
import { Bellota_Text } from "next/font/google";

export default function FileUploadDialog({
    upload,
}: {
    upload: (notebook: Notebook) => Promise<{ success: boolean }>;
}) {
    const [notebook, setNotebook] = useState<Notebook | null>({
        title: "Example title",
        tags: ["example", "ocean"],
        data: "",
    });

    if (!notebook) {
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
                        // TODO: show spinner
                    }}
                    onUploadEnd={(uploadedFiles: FileType[]) => {
                        console.log("upload ended", uploadedFiles);
                        const notebook = uploadedFiles.find((file) => {
                            // iterate to find the first parsable notebook.
                            try {
                            } catch (err) {
                                return false;
                            }
                        });
                    }}
                />
            </Box>
        );
    }
    return (
        <Box p={5}>
            <NotebookDetailsEdit notebook={notebook} upload={upload} />
        </Box>
    );
}
