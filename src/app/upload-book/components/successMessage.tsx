"use client";

import React from "react";

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    VStack,
    Button,
    ButtonGroup,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";

const SuccessMessage = ({
    status,
    title,
    description,
    onRefresh,
    againLabel,
    extraButtons,
}: {
    status: "error" | "success";
    title: string;
    description: string | React.ReactNode;
    againLabel: string;
    extraButtons?: React.ReactNode;
    onRefresh: () => void;
}) => (
    <VStack align="center" justify="center">
        <Alert
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            textAlign="center"
            status={status}
            variant="subtle"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                {title}
            </AlertTitle>
            <AlertDescription maxW="sm">{description}</AlertDescription>
        </Alert>
        <ButtonGroup w="100%">
            <Button
                w="100%"
                border="2px"
                borderColor={status === "success" ? "teal.500" : undefined}
                leftIcon={<RepeatClockIcon />}
                onClick={onRefresh}
            >
                {againLabel}
            </Button>
            {extraButtons}
        </ButtonGroup>
    </VStack>
);

export default SuccessMessage;
