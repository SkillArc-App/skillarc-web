import { FormControl, FormErrorMessage, FormLabel, Switch } from '@chakra-ui/react'
import { FieldHookConfig, useField } from 'formik'

type InputProps = {
  label: string
}

type SwitchField = InputProps & FieldHookConfig<InputTypes>

type InputTypes = number | string

export default function FormikSwitch({ label, ...props }: SwitchField) {
  const [field, meta] = useField(props)

  return (
    <FormControl isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Switch {...field} isChecked={!!field.value} />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}
