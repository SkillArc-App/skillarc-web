import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react'
import { FieldHookConfig, useField } from 'formik'

type TextAreaProps = {
  label: string
  placeholder?: string
  isRequired?: boolean
}

type TextAreaField = TextAreaProps & FieldHookConfig<string>

export default function FormTextAreaField({
  label,
  placeholder,
  isRequired,
  ...props
}: TextAreaField) {
  const [field, meta] = useField(props)

  return (
    <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Textarea bg={'white'} {...field} placeholder={placeholder}/>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}
