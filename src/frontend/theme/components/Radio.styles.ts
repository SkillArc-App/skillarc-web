import { ComponentStyleConfig } from '@chakra-ui/react'

export const RadioStyles: ComponentStyleConfig = {
  // style object for base or default style
  parts: [],
  baseStyle: {
    control: {
      bg: 'greyscale.300',
      borderColor: 'greyscale.300',
      _checked: {
        bg: 'green.600',
        borderColor: 'green.600',
        color: 'none',
      },
      alignSelf: 'start',
      mt: '0.1rem',
    },
    label: {
      color: 'greyscale.600',
      fontFamily: 'Supreme',
      fontWeight: '400',
      fontSize: '1.125rem',
      lineHeight: '1.375rem',
      pl: '0.5rem',
      touchAction: 'none',
      pointerEvents: 'none',
    },
    container: {
      touchAction: 'none',
    },
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    box: {
      container: {
        padding: '1rem',
        border: '1px',
        borderRadius: '0.25rem',
        borderColor: 'greyscale.300',
        boxShadow: 'sm',
        _checked: {
          boxShadow: '0 -0 0 2px green',
        },
      },
    },
    noControl: {
      control: {
        display: 'none',
      },
      label: {
        pl: 'none',
      },
      container: {
        padding: '1rem',
        border: '1px',
        borderRadius: '0.25rem',
        borderColor: 'greyscale.300',
        boxShadow: 'sm',
        _checked: {
          boxShadow: '0 -0 0 2px green',
        },
      },
    },
  },
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {},
}
