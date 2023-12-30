import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
    space: {},
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("gray.100", "gray.800")(props),
            },
        }),
    },
});

export default theme;
