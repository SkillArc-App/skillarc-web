import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from "@chakra-ui/react";

export type TextProps = {
  type?: "b1" | "b1Bold" | "b2" | "b2Bold" | "b3" | "b3Bold" | "overline";
} & ChakraTextProps;

export const Text = ({ type = "b1", children, ...props }: TextProps) => {
  return (
    <ChakraText variant={type} {...props}>
      {children}
    </ChakraText>
  );
};
