import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { colors } from "./foundations/colors";
import { fonts } from "./foundations/fonts";
import { HeadingStyles as Heading } from "./components/Heading.styles";
import { TextStyles as Text } from "./components/Text.styles";
import { ButtonStyles as Button } from "./components/Button.styles";
import { InputStyles as Input } from "./components/Input.styles";
import { CheckboxStyles as Checkbox } from "./components/Checkbox.styles";
import { RadioStyles as Radio } from "./components/Radio.styles";
import { AccordionStyles as Accordion } from "./components/Accordion.styles";
import { AccordionStyles as Badge } from "./components/Badge.styles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  fonts,
  colors,
  components: {
    Heading,
    Text,
    Button,
    Input,
    Checkbox,
    Radio,
    Accordion,
    Badge,
  },
  config,
});
