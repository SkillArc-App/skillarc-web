import { Box, HStack, useRadio, useRadioGroup } from '@chakra-ui/react'

function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          bg: 'green.500',
          color: 'white',
          borderColor: 'green.500',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default function RadioCardGroup(props: {
  onChange: (value: string) => void
  options: string[]
  defaultValue?: string
  value?: string
}) {
  const { onChange, options, defaultValue, value } = props
  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: defaultValue ?? 'Enrolled',
    value: value,
    onChange: onChange,
    isDisabled: true,
    isFocusable: false,
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}
