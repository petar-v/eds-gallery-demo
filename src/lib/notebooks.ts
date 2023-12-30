import { parse } from "marked";
import { load } from "cheerio";
import atob from "atob";

import Notebook from "@/definitions/Notebook";

interface Cell {
    cell_type: string;
    source: string[];
}
interface Ipynb {
    cells: Cell[];
}

const toString = (data: string | ArrayBuffer): string => {
    if (data instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(data);

        const decoder = new TextDecoder("utf-8");
        return decoder.decode(uint8Array);
    }
    return data;
};

const decode = (data: string | ArrayBuffer): string => {
    const base64String = toString(data).split(";base64,").pop();
    return atob(base64String || "");
};

export const parseNotebook = async (data: string): Promise<Notebook> => {
    const json = JSON.parse(data) as Ipynb;

    const mdCells = json.cells
        .filter((cell) => cell.cell_type === "markdown")
        .map((cell) => cell.source.join(""))
        .join("");

    const htmlString = await parse(mdCells || "");
    console.log(htmlString);

    const $ = load(htmlString);

    const title = $("h1:first").text();
    const tags = $("p:first code")
        .toArray()
        .map((tag) => $(tag).text().trim())
        .filter((tag) => tag !== "tag");

    return {
        title,
        tags,
        data,
    };
};

export const parseFileEncodedNotebook = async (
    data: string | ArrayBuffer,
): Promise<Notebook> => {
    return parseNotebook(decode(data));
};
