import { Checkbox } from '@chakra-ui/react'
import { Field } from 'formik'

const FormikCheckBox = ({ name, label }: { name: string; label: string }) => {
  return (
    <Field type="checkbox" name={name}>
      {({ field }: any) => {
        return (
          <Checkbox
            variant={'box'}
            isChecked={field.checked}
            size={'lg'}
            colorScheme="green"
            {...field}
          >
            {label}
          </Checkbox>
        )
      }}
    </Field>
  )
}

export default FormikCheckBox
