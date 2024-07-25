import { Theme, ThemeProvider } from '@chakra-ui/react'
import { theme as defaultTheme } from '@chakra-ui/theme'
import { render } from '@testing-library/react'

export const renderWithTheme = (ui: React.ReactElement, theme: Partial<Theme> = defaultTheme) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
