"use client";

import React, { useRef } from "react";

import DOMPurify from "dompurify";
import sanitizeHtml, { simpleTransform } from "sanitize-html";

import { IpynbRenderer } from "react-ipynb-renderer";

import Notebook from "@/definitions/Notebook";

import "react-ipynb-renderer/dist/styles/default.css";
import TableOfContents from "./tableOfContents";

// FIXME: links open on the same tab

const sanitizerDomPurify = (html: string): string => {
    if (!window) {
        return "";
    }
    const purify = DOMPurify();
    purify.addHook("afterSanitizeAttributes", function (node) {
        if (node.tagName === "A") {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noreferrer");
        }
        return node;
    });

    return purify.sanitize(html, {
        // USE_PROFILES: { html: true },
        FORBID_ATTR: ["style"],
        ADD_ATTR: ["target"],
    });
};

const sanitizerHtml = (html: string): string =>
    sanitizeHtml(html, {
        transformTags: {
            a: simpleTransform("a", {
                target: "_blank",
                rel: "noreferrer",
            }),
        },
        allowedAttributes: {},
    });

const SANITIZER: "sanitize-html" | "dompurify" = "dompurify";

export default function NotebookView({ notebook }: { notebook: Notebook }) {
    const articleRef = useRef<HTMLElement>(null);
    return (
        <>
            <article ref={articleRef}>
                <TableOfContents
                    source={articleRef}
                    maxDepth={3}
                    insertIDs={true}
                />
                <IpynbRenderer
                    ipynb={JSON.parse(notebook.data)}
                    seqAsExecutionCount={true}
                    syntaxTheme="prism" // or duotoneSpace
                    htmlFilter={
                        SANITIZER === "dompurify"
                            ? sanitizerDomPurify
                            : sanitizerHtml
                    }
                    // FIXME: the opticon tags
                    // TODO: make the themes switchable
                />
            </article>
        </>
    );
}
