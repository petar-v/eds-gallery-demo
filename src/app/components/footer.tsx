import React from "react";

import { Box, Container, Text, Link, Divider } from "@chakra-ui/react";
import { getInTouch } from "@/lib/nav";

const Footer = () => (
    <Box as="footer" w="full" pt={3} bg="bg.accent.default" role="contentinfo">
        <Divider m={0} />
        <Container pt={3}>
            <Text>
                This Demo is developed with ❤️ by Petar Vasilev{" "}
                <Link href={getInTouch}>(petar@flutterbit.com)</Link>.
            </Text>
        </Container>
    </Box>
);

export default Footer;
