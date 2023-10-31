import { ComponentStyleConfig } from "@chakra-ui/react";

export const AccordionStyles: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: "primary.100",
      color: "greyscale.900",
      px: "2",
      py: "1",
      borderRadius: "4px",
      textTransform: "none",
      fontWeight: "700",
    },
    secondary: {
      bg: "greyscale.300",
      color: "greyscale.900",
      px: "2",
      py: "1",
      borderRadius: "4px",
      textTransform: "none",
      fontWeight: "700",
    },
  },
};
