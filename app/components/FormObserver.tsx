import { useFormikContext } from 'formik'
import { useEffect } from 'react'

export default function FormObserver<T = unknown>({ onChange }: { onChange: (values: T) => void }) {
  const { values } = useFormikContext<T>()

  useEffect(() => onChange(values), [values, onChange])

  return <></>
}
