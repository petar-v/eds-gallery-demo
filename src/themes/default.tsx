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
    colors: {
        primary: {
            100: "#bee3f8",
            200: "#90cdf4",
            300: "#63b3ed",
            400: "#4299e1",
            500: "#3182ce", // Primary Color
            600: "#2b6cb0",
            700: "#2c5282",
            800: "#2a4365",
            900: "#1a365d",
        },
    },
});

export default theme;
