import React, {
    Ref,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import DOMPurify from "dompurify";

import "katex/dist/katex.min.css";
import "react-ipynb-renderer/dist/styles/default.css";
import { IpynbRenderer } from "react-ipynb-renderer";

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

const Ipynb = forwardRef(function IpynbRendererClientWrapped(
    {
        ipynb,
    }: {
        ipynb: string;
    },
    ref: Ref<HTMLDivElement>,
) {
    const innerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    useEffect(() => {
        if (!innerRef.current) {
            return;
        }
        // fix a css conflict between chakra ui and IpynbRenderer
        const rendered = innerRef.current.querySelector(
            "div.ipynb-renderer-root",
        ) as HTMLElement;
        console.log("ipynb element", rendered);
        rendered.style.overflowX = "hidden";
        rendered.classList.remove("container"); // Holy F&*K why does this have so many media tags?!?!
    }, []);
    return (
        <div ref={innerRef}>
            <IpynbRenderer
                language="python"
                ipynb={JSON.parse(ipynb)}
                seqAsExecutionCount={true}
                syntaxTheme="prism" // or duotoneSpace
                htmlFilter={sanitizerDomPurify}
                // FIXME: the opticon tags
            />
        </div>
    );
});

export default Ipynb;
