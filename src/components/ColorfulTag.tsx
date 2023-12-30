import { Tag } from "@chakra-ui/react";

const colors = [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
    "linkedin",
    "facebook",
    "messenger",
    "whatsapp",
    "twitter",
    "telegram",
];

export const tagColor = (tagLabel: string) => {
    const hashString = tagLabel
        .split("")
        .map((char) => char.charCodeAt(0))
        .reduce((a, b) => a + b, 0);

    return colors[hashString % colors.length];
};

const ColorfulTag = ({ tag }: { tag: string }) => {
    return <Tag colorScheme={tagColor(tag)}>{tag}</Tag>;
};

export default ColorfulTag;
