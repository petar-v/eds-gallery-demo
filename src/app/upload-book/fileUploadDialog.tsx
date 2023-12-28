"use client";

import FileUploader from "./components/fileUploader";

export default function FileUploadDialog() {
    return (
        <FileUploader
            maxSize={10 * 1000000}
            fileType="markdown"
            primaryColor={"red.400"}
            secondaryColor={"gray.100"}
            backgroundColor={"white"}
            showOver={true}
            onUploadStart={() => {
                console.log("upload start");
            }}
            onUploadEnd={() => {
                console.log("upload end");
                return false;
            }}
        />
    );
}
