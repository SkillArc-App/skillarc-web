import { useFormikContext } from 'formik'
import { useEffect } from 'react'

const FormObserver = ({ onChange }: { onChange: (values: unknown) => void }) => {
  const { values } = useFormikContext()

  useEffect(() => onChange(values), [values, onChange])

  return <></>
}

export default FormObserver
