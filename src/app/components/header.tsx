"use client";

import React, { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";

import {
    Link,
    Box,
    Flex,
    Text,
    Button,
    Stack,
    useDisclosure,
    Divider,
    Spacer,
    Icon,
    Image,
    IconProps,
} from "@chakra-ui/react";
import { Route } from "next";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { galleryRoute, getInTouch, uploadNotebookRoute } from "@/lib/nav";

const MenuToggle = ({
    toggle,
    isOpen,
}: {
    toggle: () => void;
    isOpen: boolean;
}) => {
    return (
        <Box display={{ base: "block", md: "none" }} onClick={toggle}>
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </Box>
    );
};

const CircleIcon = (props: IconProps) => (
    <Icon viewBox="0 0 200 200" {...props}>
        <path
            fill="currentColor"
            d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        />
    </Icon>
);

const MenuItem = ({
    children,
    isPrimary,
    to = galleryRoute,
}: PropsWithChildren & { to: Route; isPrimary?: boolean }) => {
    const path = usePathname() as Route;
    const isOpen = path == to;

    if (isPrimary) {
        return (
            <Link href={to}>
                <Button
                    color={["white", "white", "white", "white"]}
                    bg={["white", "white", "primary.500", "primary.500"]}
                    _hover={{
                        bg: [
                            "primary.100",
                            "primary.100",
                            "primary.600",
                            "primary.600",
                        ],
                    }}
                    colorScheme="primary"
                    isActive={!isOpen}
                    variant={"solid"}
                >
                    {children}
                </Button>
            </Link>
        );
    }
    return (
        <Link href={to}>
            <Button
                colorScheme={isOpen ? "gray" : "primary"}
                rightIcon={isOpen ? <CircleIcon /> : undefined}
                variant="link"
            >
                {children}
            </Button>
        </Link>
    );
};

const MenuLinks = () => {
    return (
        <Stack
            align="center"
            justify={["center", "space-between", "flex-end", "flex-end"]}
            direction={["column", "row", "row", "row"]}
            pt={[4, 4, 0, 0]}
            spacing={10}
        >
            <MenuItem to={galleryRoute}>Gallery</MenuItem>
            <MenuItem to={uploadNotebookRoute}>Upload a notebook</MenuItem>
            <MenuItem to={getInTouch} isPrimary>
                Get in touch!
            </MenuItem>
        </Stack>
    );
};

const NavBar = () => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <>
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                w="full"
                px={4}
                py={2}
            >
                <Link href={galleryRoute}>
                    <Image
                        boxSize="4em"
                        objectFit="cover"
                        alt="EDS book logo"
                        src={"/logo.png"}
                    />
                </Link>
                <Spacer />
                <MenuToggle toggle={onToggle} isOpen={isOpen} />
                <Box
                    flexBasis={{ base: "100%", md: "auto" }}
                    display={{ base: isOpen ? "block" : "none", md: "block" }}
                >
                    <MenuLinks />
                </Box>
            </Flex>
            <Divider w="full" m={0} />
        </>
    );
};

export default NavBar;
