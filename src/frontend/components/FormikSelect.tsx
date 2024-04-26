import { Select } from '@chakra-ui/react'
import { Field } from 'formik'

const FormikSelect = ({
  name,
  label,
  options,
}: {
  name: string
  label: string
  options: { key: string; value: string }[]
}) => {
  return (
    <Field as="select" name={name} type="select">
      {({ field }: any) => {
        return (
          <Select placeholder={label} {...field}>
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))}
          </Select>
        )
      }}
    </Field>
  )
}

export default FormikSelect
