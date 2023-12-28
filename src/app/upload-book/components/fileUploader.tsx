import { Box, Text, Stack, Image, ColorProps } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

export interface fileType {
    path: string;
    type: "file" | "folder";
    name: string;
    mimeType: string;
    data: string;
}

export type FileTypeProp =
    | "image"
    | "video"
    | "audio"
    | "text"
    | "pdf"
    | "markdown"
    | "other";

const fileTypeText = (fileType: FileTypeProp): string => {
    const map: { [key in FileTypeProp]: string } = {
        image: "Image files",
        video: "Video files",
        audio: "Audio files",
        text: "Text files",
        pdf: "Pdf files",
        markdown: "Markdown files",
        other: "Other files",
    };
    return map[fileType];
};

async function getAllFileEntries(
    dataTransferItemList: DataTransferItemList,
    maxSize: number,
    fileType: FileTypeProp,
): Promise<fileType[]> {
    let fileEntries: fileType[] = [];
    let queue = [];

    for (let i = 0; i < dataTransferItemList.length; i++) {
        // Note webkitGetAsEntry a non-standard feature and may change
        // Usage is necessary for handling directories
        queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }

    while (queue.length > 0) {
        let entry = queue.shift();

        if (entry && entry.isFile) {
            // This is a file
            await new Promise((resolve, reject) => {
                // Read file data and save to base64
                (entry as FileSystemFileEntry).file((file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                        // Do all the checks
                        if (
                            (maxSize == -1 || file.size < maxSize) &&
                            (file.type.split("/")[0] == fileType ||
                                (file.type == "application/pdf" &&
                                    fileType == "pdf") ||
                                fileType == "other")
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
                                data: reader.result?.toString() || "",
                            });
                        }
                        resolve(0);
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

            let reader = (entry as FileSystemDirectoryEntry).createReader();
            queue.push(...(await readAllDirectoryEntries(reader)));
        }
    }

    return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
async function readAllDirectoryEntries(
    directoryReader: FileSystemDirectoryReader,
) {
    let entries = [];
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
        console.log(err);
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
}: {
    maxSize?: number;
    fileType?: FileTypeProp;
    primaryColor?: ColorProps["color"];
    secondaryColor?: ColorProps["color"];
    backgroundColor?: ColorProps["color"];
    showOver?: boolean;
    onUploadStart: () => void;
    onUploadEnd: (files: fileType[]) => void;
}) {
    // The main render of the component
    return (
        <Stack
            backgroundColor={backgroundColor}
            transition="opacity 250ms ease-in-out"
            direction="column"
            spacing="1rem"
            padding="1rem 4rem"
            alignItems="center"
            textAlign="center"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="10px"
            onDragOver={(e) => {
                // Prevent default browser action for file drag
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "0.6");
            }}
            onDragLeave={(e) => {
                // Prevent default browser action for file drag
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "1");
            }}
            onDrop={async (e) => {
                // Prevent default browser action for file drop
                e.stopPropagation();
                e.preventDefault();

                showOver && (e.currentTarget.style.opacity = "1");

                if (e.dataTransfer.files.length > 0) {
                    // Call this before processing the files
                    onUploadStart();

                    // Process the files
                    let items = await getAllFileEntries(e.dataTransfer.items, maxSize, fileType);

                    // Call this after the processing of the file is finished
                    onUploadEnd(items);
                }
            }}
        >
            <Box
                padding="1rem"
                backgroundColor={secondaryColor}
                borderRadius="10px"
                margin="auto"
            >
                <AttachmentIcon />
            </Box>
            <Stack direction="column" spacing="0.5rem">
                <Box fontSize="sm">
                    <Text
                        position="relative"
                        display="inline"
                        color={primaryColor}
                        fontWeight="bold"
                        cursor="pointer"
                    >
                        Click to upload
                        <input /* This component is only clickable but not viewable */
                            type="file"
                            placeholder=""
                            accept={
                                fileType == "pdf"
                                    ? "application/pdf"
                                    : fileType == "other"
                                      ? "*"
                                      : fileType + "/*"
                            }
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
                            onChange={async (e) => {
                                // Prevent default browser action for file upload
                                e.preventDefault();
                                e.stopPropagation();

                                if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                ) {
                                    // Call this before processing the files
                                    onUploadStart();

                                    let items: fileType[] = [];

                                    for (
                                        var i = 0;
                                        i < e.target.files.length;
                                        i++
                                    ) {
                                        // This is a file (cannot upload folder via input tag)
                                        await new Promise((resolve, reject) => {
                                            // Read file data and save to base64
                                            const file =
                                                e.target.files?.item(i);

                                            if (file) {
                                                const reader = new FileReader();
                                                reader.readAsDataURL(file);

                                                reader.onload = () => {
                                                    // Do all the checks
                                                    if (
                                                        (maxSize == -1 ||
                                                            file.size <
                                                                maxSize) &&
                                                        (file.type.split(
                                                            "/",
                                                        )[0] == fileType ||
                                                            (file.type ==
                                                                "application/pdf" &&
                                                                fileType ==
                                                                    "pdf") ||
                                                            fileType == "other")
                                                    ) {
                                                        items.push({
                                                            path: "/",
                                                            type: "file",
                                                            name: file.name,
                                                            mimeType:
                                                                file.type ||
                                                                "application/octet-stream",
                                                            data:
                                                                reader.result?.toString() ||
                                                                "",
                                                        });
                                                    }
                                                    resolve(0);
                                                };

                                                reader.onerror = reject;
                                            }
                                        });
                                    }

                                    // Call this after the processing of the file is finished
                                    onUploadEnd(items);
                                }
                            }}
                        />
                    </Text>{" "}
                    <Text display="inline">or drag and drop</Text>
                </Box>
                <Text fontSize="xs">
                    {fileTypeText(fileType)}
                    {maxSize != -1
                        ? "up to " + formatFileSize(maxSize)
                        : "up to unlimited GBs"}
                </Text>
            </Stack>
        </Stack>
    );
}