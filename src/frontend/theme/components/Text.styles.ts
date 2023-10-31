import { ComponentStyleConfig } from '@chakra-ui/react'
import { HeadingStyles } from './Heading.styles'

export const TextStyles: ComponentStyleConfig = {
  // style object for base or default style
  // baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  // sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    b1: {
      fontSize: '1.125rem',
      fontStyle: 'normal',
      lineHeight: '1.375rem',
      fontWeight: 400,
    },
    b1Bold: {
      fontSize: '1.125rem',
      fontStyle: 'normal',
      lineHeight: '1.375rem',
      fontWeight: 700,
    },
    b2: {
      fontSize: '0.9375rem',
      fontStyle: 'normal',
      lineHeight: '1.125rem',
      fontWeight: 400,
    },
    b2Bold: {
      fontSize: '0.9375rem',
      fontStyle: 'normal',
      lineHeight: '1.125rem',
      fontWeight: 700,
    },
    b3: {
      fontSize: '0.75rem',
      fontStyle: 'normal',
      lineHeight: '0.9375',
      fontWeight: 400,
    },
    b3Bold: {
      fontSize: '0.75rem',
      fontStyle: 'normal',
      lineHeight: '0.9375',
      fontWeight: 700,
    },
    h5: {
      fontSize: '18',
      lineHeight: '22',
      fontStyle: 'bold',
    },
    overline: {
      fontSize: '0.625rem',
      fontStyle: 'normal',
      lineHeight: '0.8125rem',
      fontWeight: 700,
      fontVariant: 'small-caps',
      letterSpacing: '0.2em',
    },

    ...HeadingStyles.variants,
  },
  // default values for 'size', 'variant' and 'colorScheme'
  // defaultProps: {},
}
