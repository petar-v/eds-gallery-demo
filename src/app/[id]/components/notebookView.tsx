"use client";

import React from "react";

import DOMPurify from "dompurify";
import sanitizeHtml from "sanitize-html";

import { IpynbRenderer } from "react-ipynb-renderer";

import Notebook from "@/definitions/Notebook";

import "react-ipynb-renderer/dist/styles/default.css";

// FIXME: links open on the same tab

const sanitizerDomPurify = (html: string): string => {
    if (!window) {
        return "";
    }
    const purify = DOMPurify();
    purify.addHook("afterSanitizeAttributes", function (node) {
        if (node.tagName === "A") {
            console.log("ADD ATTR");
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

const sanitizerHtml = (html: string): string => {
    return sanitizeHtml(html, {
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", {
                target: "_blank",
                rel: "noreferrer",
            }),
        },
        allowedAttributes: {},
    });
};

const SANITIZER: "sanitize-html" | "dompurify" = "dompurify";

export default function NotebookView({ notebook }: { notebook: Notebook }) {
    return (
        <IpynbRenderer
            ipynb={JSON.parse(notebook.data)}
            seqAsExecutionCount={true}
            syntaxTheme="prism" // or duotoneSpace
            htmlFilter={
                SANITIZER === "dompurify" ? sanitizerDomPurify : sanitizerHtml
            }
            // TODO: make the themes switchable
        />
    );
}
