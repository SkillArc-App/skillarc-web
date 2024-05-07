import { FieldProps } from 'formik'
import Select from 'react-select'
import { MultiValue, Options } from 'react-select/dist/declarations/src/types'

interface Option {
  label: string
  value: string
}

interface CustomSelectProps extends FieldProps {
  options: Options<Option>
  isMulti?: boolean
  className?: string
  placeholder?: string
}

export const FormikMultiSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = true,
}: CustomSelectProps) => {
  const onChange = (option: MultiValue<Option | Option[]>) => {
    form.setFieldValue(
      field.name,
      (option as Option[]).map((item: Option) => item.value),
    )
  }

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value)
    } else {
      return isMulti ? [] : ('' as any)
    }
  }

  return (
    <Select
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
    />
  )
}

export default FormikMultiSelect
