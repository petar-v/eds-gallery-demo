import React from "react";

import { Box, Text, Stack, ColorProps } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { FileType } from "@/definitions/FileType";
import { ChangeEventHandler } from "react";

export type FileTypeProp =
    | "image"
    | "video"
    | "audio"
    | "text"
    | "pdf"
    | "markdown"
    | "jupyter"
    | "other";

const fileTypeText = (fileType: FileTypeProp): string => {
    const map: { [key in FileTypeProp]: string } = {
        image: "Image files",
        video: "Video files",
        audio: "Audio files",
        text: "Text files",
        pdf: "Pdf files",
        markdown: "Markdown files",
        jupyter: "Jupyter notebook file",
        other: "Other files",
    };
    return map[fileType];
};

const validateFileType = (file: File, fileType: FileTypeProp): boolean => {
    if (fileType == "other") return true;

    if (file.type == "application/pdf" && fileType == "pdf") return true;

    if (
        ["application/x-ipynb+json", ""].includes(file.type) &&
        fileType === "jupyter"
    )
        return true;

    return file.type.split("/")[0] == fileType;
};

const fileTypeToMime = (fileType: FileTypeProp): string => {
    if (fileType == "pdf") return "application/pdf";

    if (fileType == "other") return "*";

    if (fileType == "jupyter") return ".ipynb";

    return fileType + "/*";
};

async function getAllFileEntries(
    dataTransferItemList: DataTransferItemList,
    maxSize: number,
    fileType: FileTypeProp,
): Promise<FileType[]> {
    const fileEntries: FileType[] = [];
    const queue = [];

    for (let i = 0; i < dataTransferItemList.length; i++) {
        // Note webkitGetAsEntry a non-standard feature and may change
        // Usage is necessary for handling directories
        queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }

    while (queue.length > 0) {
        const entry = queue.shift();

        if (entry && entry.isFile) {
            // This is a file
            await new Promise<void>((resolve, reject) => {
                // Read file data and save to base64
                (entry as FileSystemFileEntry).file((file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                        if (
                            (maxSize == -1 || file.size < maxSize) &&
                            validateFileType(file, fileType)
                        ) {
                            fileEntries.push({
                                path: (
                                    entry as FileSystemFileEntry
                                ).fullPath.replace(
                                    (entry as FileSystemFileEntry).name,
                                    "",
                                ),
                                type: "file",
                                name: file.name,
                                mimeType:
                                    file.type || "application/octet-stream",
                                data: reader.result,
                            });
                        }
                        resolve();
                    };

                    reader.onerror = reject;
                });
            });
        } else if (entry && entry.isDirectory) {
            // This is a folder
            fileEntries.push({
                path: entry.fullPath.replace(entry.name, ""),
                type: "folder",
                name: (entry as FileSystemDirectoryEntry).name,
                mimeType: "folder/folder",
                data: "",
            });

            const reader = (entry as FileSystemDirectoryEntry).createReader();
            queue.push(...(await readAllDirectoryEntries(reader)));
        }
    }

    return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
async function readAllDirectoryEntries(
    directoryReader: FileSystemDirectoryReader,
) {
    const entries = [];
    let readEntries: any = await readEntriesPromise(directoryReader);

    while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader);
    }

    return entries;
}

// Wrap readEntries in a promise to make working with readEntries easier
async function readEntriesPromise(directoryReader: FileSystemDirectoryReader) {
    try {
        return await new Promise((resolve, reject) => {
            directoryReader.readEntries(resolve, reject);
        });
    } catch (err) {
        console.error(err);
    }
}

function formatFileSize(bytes: number) {
    if (bytes >= 1000000000000) {
        return (bytes / 100000000000).toFixed(1) + " TB";
    }
    if (bytes >= 1000000000) {
        return (bytes / 100000000).toFixed(1) + " GB";
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(1) + " MB";
    }
    if (bytes >= 1000) {
        return (bytes / 1000).toFixed(1) + " KB";
    }
    if (bytes > 1) {
        return bytes + " bytes";
    }
    if (bytes == 1) {
        return bytes + " byte";
    }
    return "0 GB";
}

export default function FileUploader({
    maxSize = 10 * 1000000,
    fileType = "other",
    primaryColor = "blue.400",
    secondaryColor = "gray.100",
    backgroundColor = "white",
    showOver = true,
    onUploadStart,
    onUploadEnd,
    preview,
}: {
    maxSize?: number;
    fileType?: FileTypeProp;
    primaryColor?: ColorProps["color"];
    secondaryColor?: ColorProps["color"];
    backgroundColor?: ColorProps["color"];
    showOver?: boolean;
    onUploadStart: () => void;
    onUploadEnd: (files: FileType[]) => void;
    preview?: React.ReactNode;
}) {
    const onFileSelectionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        // Prevent default browser action for file upload
        e.preventDefault();
        e.stopPropagation();

        if (e.target.files && e.target.files.length > 0) {
            // Call this before processing the files
            onUploadStart();

            const promisedItems: Promise<FileType>[] = [...e.target.files]
                .filter((f) => f)
                .filter((file) => {
                    return (
                        (maxSize == -1 || file.size < maxSize) &&
                        validateFileType(file, fileType)
                    );
                })
                .map((file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    return new Promise<FileType>((resolve, reject) => {
                        reader.onload = () => {
                            resolve({
                                path: "/",
                                type: "file",
                                name: file.name,
                                mimeType:
                                    file.type || "application/octet-stream",
                                data: reader.result || "",
                            });
                        };
                        reader.onerror = reject;
                    });
                });

            // Call this after the processing of the file is finished
            Promise.all(promisedItems).then(onUploadEnd).catch(console.error);
        }
    };

    return (
        <Stack
            alignItems="center"
            direction="column"
            p="1rem 4rem"
            textAlign="center"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="md"
            transition="opacity 250ms ease-in-out"
            bgColor={backgroundColor}
            onDragLeave={(e) => {
                // Prevent default browser action for file drag
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "1");
            }}
            onDragOver={(e) => {
                // Prevent default browser action for file drag
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "0.6");
            }}
            onDrop={(e) => {
                // Prevent default browser action for file drop
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "1");

                if (e.dataTransfer.files.length > 0) {
                    // Call this before processing the files
                    onUploadStart();

                    // Process the files
                    getAllFileEntries(e.dataTransfer.items, maxSize, fileType)
                        .then(onUploadEnd)
                        .catch(console.error);
                }
            }}
            spacing="1rem"
        >
            <Box m="auto" p="1rem" borderRadius="10px" bgColor={secondaryColor}>
                {preview ? preview : <AttachmentIcon />}
            </Box>
            <Stack direction="column" spacing="0.5rem">
                <Box>
                    <Text
                        pos="relative"
                        display="inline"
                        color={primaryColor}
                        fontWeight="bold"
                        cursor="pointer"
                    >
                        Click to upload
                        <input /* This component is only clickable but not viewable */
                            type="file"
                            placeholder=""
                            accept={fileTypeToMime(fileType)}
                            style={{
                                opacity: "0",
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                marginTop: "-2px",
                                fontSize: "0",
                                cursor: "pointer",
                            }}
                            multiple={true}
                            onChange={onFileSelectionChange}
                        />
                    </Text>{" "}
                    <Text display="inline">or drag and drop</Text>
                </Box>
                <Text fontSize="xs">
                    {fileTypeText(fileType)}
                    {maxSize != -1
                        ? " up to " + formatFileSize(maxSize)
                        : " up to unlimited GBs"}
                </Text>
            </Stack>
        </Stack>
    );
}
