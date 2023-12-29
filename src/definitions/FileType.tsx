export interface FileType {
    path: string;
    type: "file" | "folder";
    name: string;
    mimeType: string;
    data: ArrayBuffer | string | null;
}
