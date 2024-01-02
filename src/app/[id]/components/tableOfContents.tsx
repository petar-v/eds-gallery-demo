import React, { useEffect, RefObject, useState, createRef } from "react";

import { nanoid } from "nanoid";
import { slug } from "@/lib/nav";
import useScrollSpy from "react-use-scrollspy";

import NextLink from "next/link";
import { List, ListItem, Link } from "@chakra-ui/react";

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

const MAX_DEPTH_TOC = 4;

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

const refFromElement = (element: HTMLElement): RefObject<HTMLElement> => {
    const elementRef = {
        ...createRef<HTMLElement>(),
        current: element,
    };
    return elementRef;
};

const TableOfContents = ({
    source,
    maxDepth,
    insertIDs,
}: {
    source: RefObject<HTMLElement>;
    maxDepth?: number;
    insertIDs?: boolean;
}) => {
    const [toc, setToc] = useState<NestedHeading[]>([]);

    const [headingRefs, setHeadingRefs] = useState<RefObject<HTMLElement>[]>(
        [],
    );
    const activeSection = useScrollSpy({
        sectionElementRefs: headingRefs,
        offsetPx: -80,
    });

    useEffect(() => {
        const article = source.current;
        if (!article) {
            return;
        }
        const selector = [...Array(maxDepth || MAX_DEPTH_TOC).keys()]
            .map((level) => `h${level + 1}`)
            .join(",");

        const headings: Heading[] = Array.from(
            article.querySelectorAll(selector),
        ).map((heading: Element, i: number) => {
            // TODO: attach IDs to the objects themselves to pick up the scroll
            const label = heading.textContent || ""; // || heading.innerText;
            if (insertIDs) {
                heading.id = `${nanoid(6)}-${slug(label)}`;
            }
            setHeadingRefs([
                ...headingRefs,
                refFromElement(heading.parentElement as HTMLElement),
            ]);
            return {
                label,
                id: heading.id || `heading-${i}`,
                level: parseInt(heading.nodeName.replace("H", "")),
            };
        });

        setToc(createToCFromHeadings(headings));
    }, [source, maxDepth, insertIDs]);

    console.log("Active section", activeSection);
    console.log("heading refs", headingRefs);

    const headingsToElement = (headings: NestedHeading[], level: number) => {
        if (headings.length === 0) {
            return <></>;
        }
        return (
            <List>
                {headings.map(({ id, label, subheadings }, index) => (
                    <ListItem key={`heading-${index}-${id}`} noOfLines={1}>
                        <Link
                            as={NextLink}
                            textDecoration={
                                activeSection === 1 ? "underline" : undefined
                            }
                            href={`#${id}`}
                        >
                            {index + 1} {label}
                        </Link>
                        {headingsToElement(subheadings, level + 1)}
                    </ListItem>
                ))}
            </List>
        );
    };
    return <nav>Table of contents: {headingsToElement(toc, 1)}</nav>;
};

export default TableOfContents;
