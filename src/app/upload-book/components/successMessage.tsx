"use client";

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
}: {
    status: "error" | "success";
    title: string;
    description: string | React.ReactNode;
    againLabel: string;
    onRefresh: () => void;
}) => (
    <VStack align="center" justify="center">
        <Alert
            status={status}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                {title}
            </AlertTitle>
            <AlertDescription maxWidth="sm">{description}</AlertDescription>
        </Alert>
        <ButtonGroup w="100%">
            <Button
                onClick={onRefresh}
                border="2px"
                w="100%"
                borderColor={status === "success" ? "green.500" : undefined}
                leftIcon={<RepeatClockIcon />}
            >
                {againLabel}
            </Button>
        </ButtonGroup>
    </VStack>
);

export default SuccessMessage;
