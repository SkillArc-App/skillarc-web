import { FieldHookConfig, useField } from 'formik'

type RequiredFieldProps<T> = { isRequired?: boolean } & FieldHookConfig<T>

function presentValidation<T>(value: T) {
  let error
  if (!value) {
    error = 'Required'
  }
  return error
}

export function useRequiredField<T>({ isRequired, ...props }: RequiredFieldProps<T>) {
  let validate = props.validate
  if (isRequired && !validate) {
    validate = presentValidation
  }

  return useField({ ...props, validate })
}
