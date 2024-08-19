import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { FieldHookConfig } from 'formik'
import Select from 'react-select'
import { MultiValue, Options } from 'react-select/dist/declarations/src/types'
import { useRequiredField } from '../hooks/useRequiredField'

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Options<Option>
  className?: string
  placeholder?: string
  label?: string
  isRequired?: boolean
}

type MultiSelectField = MultiSelectProps & FieldHookConfig<string[]>

const FormikMultiSelect = ({ options, isRequired, label, ...props }: MultiSelectField) => {
  const [field, meta, helpers] = useRequiredField<string[]>({ ...props, isRequired })

  const onChange = (option: MultiValue<Option>) => {
    helpers.setValue(option.map((item) => item.value))
  }

  const values = options.filter(({ value }) => field.value.includes(value))

  return (
    <FormControl isRequired={isRequired} isInvalid={meta.touched && !!meta.error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Select
        className={props.className}
        name={field.name}
        inputId={field.name}
        value={values}
        onChange={onChange}
        placeholder={props.placeholder}
        options={options}
        isMulti={true}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default FormikMultiSelect
