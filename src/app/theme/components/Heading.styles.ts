import { ComponentStyleConfig } from "@chakra-ui/react";

export const HeadingStyles: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  // sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    display: {
      fontSize: ["4rem", null, "4.5rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["4.25rem", null, "4.75rem", null, null, null],
      fontWeight: 700,
    },
    h1: {
      fontSize: ["2.125rem", null, "2.75rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["2.375rem", null, "3rem", null, null, null],
      fontWeight: 700,
    },
    h2: {
      fontSize: ["1.625rem", null, "2.125rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["1.875rem", null, "2.375rem", null, null, null],
      fontWeight: 700,
    },
    h3: {
      fontSize: ["1.375rem", null, "1.625rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["1.625rem", null, "1.875rem", null, null, null],
      fontWeight: 700,
    },
    h4: {
      fontSize: ["1.125rem", null, "1.375rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["1.375rem", null, "1.625rem", null, null, null],
      fontWeight: 700,
    },
    h5: {
      fontSize: ["0.9375rem", null, "1.125rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["1.125rem", null, "1.375rem", null, null, null],
      fontWeight: 700,
    },
    h6: {
      fontSize: ["0.75rem", null, "0.9375rem", null, null, null],
      fontStyle: "normal",
      lineHeight: ["0.9375rem", null, "1.125rem", null, null, null],
      fontWeight: 700,
    },
  },
  // default values for 'size', 'variant' and 'colorScheme'
  // defaultProps: {},
};
