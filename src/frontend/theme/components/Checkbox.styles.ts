import { ComponentStyleConfig } from '@chakra-ui/react'

export const CheckboxStyles: any = {
  // style object for base or default style
  baseStyle: {
    control: {
      bg: 'greyscale.300',
      borderColor: 'greyscale.300',
      _checked: {
        bg: 'green.600',
        borderColor: 'green.600',
        color: 'white',
      },
      borderRadius: '0.125rem',
      boxShadow: 'sm',
    },
    label: {
      color: 'greyscale.600',
      fontWeight: '400',
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
    multiLine: {
      control: {
        position: 'absolute',
        top: '1.25rem',
      },
      label: {
        ml: '1.5rem',
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
