import {
  Heading as ChakraHeading,
  HeadingProps as ChakraHeadingProps,
} from "@chakra-ui/react";

export type HeadingProps = {
  type?: "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & ChakraHeadingProps;

export const Heading = ({ type = "h1", children, ...props }: HeadingProps) => {
  const htmlType = setHtmlType(type);
  return (
    <ChakraHeading as={htmlType} variant={type} {...props}>
      {children}
    </ChakraHeading>
  );
};

// Helper function to set the html type for the heading component
// This ensures we're writing semantic html for accessibility
const setHtmlType = (type: HeadingProps["type"]) => {
  switch (type) {
    //multiple case statements are the equivalent of "OR" clauses
    case "h1":
      return "h1";
    case "display":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    default:
      return "h1";
  }
};
