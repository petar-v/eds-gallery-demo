import React, { useEffect, RefObject, useState, createRef } from "react";

import { nanoid } from "nanoid";
import { slug } from "@/lib/nav";

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

const MAX_DEPTH_TOC = 6;

const createToCFromHeadings = (headings: Heading[]): NestedHeading[] => {
    const topLevel = headings[0].level;
    const getLastAtLevel = (
        nestedList: NestedHeading[],
        level: number,
    ): NestedHeading | undefined => {
        if (nestedList.length === 0) {
            return undefined;
        }
        const last = nestedList[nestedList.length - 1];
        if (level == topLevel) {
            return last;
        }
        return getLastAtLevel(last.subheadings, level - 1);
    };

    const nestedList: NestedHeading[] = [];
    headings.forEach(({ id, label, level }) => {
        const entry: NestedHeading = {
            id,
            label,
            subheadings: [],
        };
        if (level === topLevel) {
            nestedList.push(entry);
            return;
        }
        getLastAtLevel(nestedList, level - 1)?.subheadings.push(entry);
    });
    return nestedList;
};

const TableOfContents = ({
    source,
    maxDepth,
    insertIDs,
    includeH1,
}: {
    source: RefObject<HTMLElement>;
    maxDepth?: number;
    insertIDs?: boolean;
    includeH1?: boolean;
}) => {
    const [toc, setToc] = useState<NestedHeading[]>([]);

    useEffect(() => {
        const article = source.current;
        if (!article) {
            return;
        }
        const selectors = [...Array(maxDepth || MAX_DEPTH_TOC).keys()].map(
            (level) => `h${level + 1}`,
        );
        if (!includeH1) {
            selectors.shift();
        }
        const headings: Heading[] = Array.from(
            article.querySelectorAll(selectors.join(",")),
        ).map((heading: Element, i: number) => {
            const label = heading.textContent || ""; // || heading.innerText;
            if (insertIDs) {
                heading.id = `${nanoid(5)}-${slug(label)}`;
            }
            return {
                label,
                level: parseInt(heading.nodeName.replace("H", "")),
                id: heading.id || `heading-${i}`,
            };
        });
        setToc(createToCFromHeadings(headings));
    }, [source, maxDepth, insertIDs, includeH1]);

    const headingsToElement = (
        headings: NestedHeading[],
        level: number,
        upperLevel?: number[],
    ) => {
        if (headings.length === 0) {
            return <></>;
        }
        return (
            <List pl={level === 1 ? 0 : ""}>
                {headings.map(({ id, label, subheadings }, index) => {
                    const levelAddr = [...(upperLevel || []), index + 1];
                    return (
                        <ListItem key={`heading-${index}-${id}`} fontSize="sm">
                            <Link as={NextLink} href={`#${id}`}>
                                {levelAddr.join(".")}. {label}
                            </Link>
                            {headingsToElement(
                                subheadings,
                                level + 1,
                                levelAddr,
                            )}
                        </ListItem>
                    );
                })}
            </List>
        );
    };
    return headingsToElement(toc, 1);
};

export default TableOfContents;
