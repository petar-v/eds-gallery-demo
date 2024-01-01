import React, { useEffect, RefObject, useState } from "react";
import { As, Heading } from "@chakra-ui/react";

export type Heading = {
    id: string;
    level: number; // is it a h1, h2, etc...
    label: string;
};

export type NestedHeading = {
    id: string;
    label: string;
    subheadings: NestedHeading[];
};

const createToCFromHeadings = (headings: Heading[]): NestedHeading[] => {
    // TODO: refactor this for clarity
    const result: NestedHeading[] = [];
    headings.forEach(({ id, label, level }) => {
        let currentLevelHeadings = result;
        for (let i = 1; i < level; i++) {
            const lastHeading =
                currentLevelHeadings[currentLevelHeadings.length - 1];

            if (lastHeading) {
                currentLevelHeadings = lastHeading.subheadings;
            }
        }
        currentLevelHeadings.push({ id, label, subheadings: [] });
    });
    return result;
};

const TableOfContents = ({
    source,
    maxDepth,
}: {
    source: RefObject<HTMLElement>;
    maxDepth?: number;
}) => {
    const [toc, setToc] = useState<NestedHeading[]>([]);
    useEffect(() => {
        const article = source.current;
        if (!article) {
            return;
        }
        const selector = [...Array(maxDepth || 4).keys()]
            .map((level) => `h${level + 1}`)
            .join(",");

        const headings: Heading[] = Array.from(
            article.querySelectorAll(selector),
        ).map((heading: Element, i: number) => {
            // TODO: attach IDs to the objects themselves to pick up the scroll
            return {
                id: heading.id || `heading-${i}`,
                label: heading.textContent || "", // || heading.innerText;
                level: parseInt(heading.nodeName.replace("H", "")),
            };
        });

        setToc(createToCFromHeadings(headings));
    }, [source, maxDepth]);

    const headingToElement = (
        headings: NestedHeading[],
        level: number,
    ): React.ReactNode[] =>
        (headings.length > 0 &&
            headings.map(({ id, label, subheadings }, i) => (
                <>
                    <Heading
                        key={`heading-${i}-${id}`}
                        as={`h${level}` as As}
                        ml={`${level * 2}rem`}
                        noOfLines={1}
                    >
                        {label}
                    </Heading>
                    {headingToElement(subheadings, level + 1)}
                </>
            ))) ||
        [];

    return <>Table of contents: {headingToElement(toc, 1)}</>;
};

export default TableOfContents;
