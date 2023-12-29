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
    const dataString = toString(data);

    const base64String = dataString.split(";base64,").pop();
    return atob(base64String || "");
};

export const parseNotebook = async (
    data: string | ArrayBuffer,
): Promise<Notebook> => {
    const decoded = decode(data);
    const json = JSON.parse(decoded) as Ipynb;
    const firstCell = json.cells
        .find((cell) => cell.cell_type === "markdown")
        ?.source.join("");

    const htmlString = await parse(firstCell || "");

    const $ = load(htmlString);

    const title = $("h1:first").text();
    const tags = $("p:first code")
        .toArray()
        .map((tag) => $(tag).text().trim())
        .filter((tag) => tag !== "tag");
    console.log(title, tags);

    const nb = {
        title,
        tags,
        data: decoded,
    };

    return nb;
};
