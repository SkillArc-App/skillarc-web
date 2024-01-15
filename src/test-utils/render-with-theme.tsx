import { Theme, ThemeProvider } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";
import { render } from "@testing-library/react";

export const renderWithTheme = (ui: React.ReactElement, theme: Partial<Theme> = defaultTheme) => {
  const Wrapper = ({ children }: { children: React.ReactElement}) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper });
};
