import { Field, FieldProps } from 'formik'
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

const MultiSelect = ({
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

const FormikMultiSelect = ({
  ariaLabel,
  name,
  placeholder,
  options,
}: {
  options: Options<Option>
  ariaLabel: string
  name: string
  placeholder: string
}) => {
  return (
    <Field
      aria-label={ariaLabel}
      name={name}
      placeholder={placeholder}
      component={MultiSelect}
      options={options}
    />
  )
}

export default FormikMultiSelect
