"use client";

import React, { useRef, useEffect } from "react";

import DOMPurify from "dompurify";
// import sanitizeHtml from "sanitize-html";

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

// const sanitizerHtml = (html: string): string => {
//     return sanitizeHtml(html, {
//         transformTags: {
//             a: sanitizeHtml.simpleTransform("a", {
//                 target: "_blank",
//                 rel: "noreferrer",
//             }),
//         },
//         allowedAttributes: {},
//     });
// };

// const SANITIZER: "sanitize-html" | "dompurify" = "dompurify";

export default function NotebookView({ notebook }: { notebook: Notebook }) {
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const article = articleRef.current;
        if (article) {
            console.log("ARTICLE", article);
            article.querySelectorAll("h1,h2,h3,h4").forEach((heading, i) => {
                heading.id = `heading-${i}`;
                console.log(
                    `${heading.nodeName}:`,
                    heading.id,
                    heading.innerHTML,
                );
            });
        }
    }, []);

    return (
        <>
            <article ref={articleRef}>
                <IpynbRenderer
                    ipynb={JSON.parse(notebook.data)}
                    seqAsExecutionCount={true}
                    syntaxTheme="prism" // or duotoneSpace
                    htmlFilter={sanitizerDomPurify}
                    // TODO: make the themes switchable
                />
            </article>
        </>
    );
}
