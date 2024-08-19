import { FormControl, FormErrorMessage, FormLabel, Textarea } from '@chakra-ui/react'
import { FieldHookConfig } from 'formik'
import { useRequiredField } from '../hooks/useRequiredField'

type TextAreaProps = {
  label: string
  placeholder?: string
  isRequired?: boolean
}

type TextAreaField = TextAreaProps & FieldHookConfig<string>

export default function FormikTextArea({
  label,
  placeholder,
  isRequired,
  ...props
}: TextAreaField) {
  const [field, meta] = useRequiredField({ ...props, isRequired })

  return (
    <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Textarea bg={'white'} {...field} placeholder={placeholder} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}
