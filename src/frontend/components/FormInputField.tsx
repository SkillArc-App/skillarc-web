import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { FieldHookConfig, useField } from 'formik'
import { HTMLInputTypeAttribute } from 'react'

type InputProps = {
  label: string
  placeholder?: string
  min?: string | number
  max?: string | number
  type: HTMLInputTypeAttribute
  isRequired?: boolean
}

type InputField<T extends InputTypes> = InputProps & FieldHookConfig<T>

type InputTypes = number | string | undefined

export default function FormInputField<T extends InputTypes>({
  label,
  placeholder,
  type,
  min,
  max,
  isRequired,
  ...props
}: InputField<T>) {
  const [field, meta] = useField(props)

  return (
    <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Input bg={'white'} {...field} min={min} max={max} placeholder={placeholder} type={type} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}
