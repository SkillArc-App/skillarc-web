import { ComponentStyleConfig } from '@chakra-ui/react'

export const ButtonStyles: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: 'greyscale.900',
      color: 'greyscale.100',
      borderRadius: '.25rem',
      _hover: { bg: 'greyscale.800', _disabled: { bg: 'greyscale.900' } },
      _disabled: { opacity: '40%' },
      height: '3.375rem',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    secondary: {
      bg: 'white',
      color: 'greyscale.600',
      border: '1px',
      borderColor: 'greyscale.600',
      borderRadius: '.25rem',
      _hover: { bg: 'greyscale.200' },
      _disabled: {},
      height: '3.375rem',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    tertiary: {
      bg: 'none',
      color: 'greyscale.600',
      textDecor: 'underline',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    remove: {
      bg: 'white',
      color: 'error.300',
      border: '1px',
      borderColor: 'error.300',
      borderRadius: '.25rem',
      _hover: { bg: 'error.300', color: 'white' },
      _disabled: {},
      height: '3.375rem',
    },
    icon: {
      bg: 'greyscale.200',
      p: '0rem',
    },
  },
}
