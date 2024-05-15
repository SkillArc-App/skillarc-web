import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react'
import { FieldHookConfig, useField } from 'formik'

type SelectProps = {
  label: string
  isRequired?: boolean
  options: { key: string; value: string }[]
}

type SelectField = SelectProps & FieldHookConfig<string>

const FormikSelect = ({
  label,
  isRequired,
  options,
  ...props
}: SelectField) => {
  const [field, meta] = useField(props)

  return (
    <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Select placeholder={label} {...field}>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.value}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default FormikSelect
