import { ReliabilityResponse } from '@/common/types/OnboardingResponse'
import { Button, Checkbox, Heading, Stack } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

const JOB = "I've had or currently have a job"
const TRAINING_PROGRAM = "I've attended a Training Program"
const EDUCATION = 'I have a High School Diploma / GED'
const OTHER = "I have other experience I'd like to share"

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

type ReliabilityProps = {
  job: boolean
  trainingProgram: boolean
  education: boolean
  other: boolean
}

export const Reliability = ({
  onSubmit,
}: {
  onSubmit: (responses: ReliabilityResponse) => void
}) => {
  const initialValue: ReliabilityProps = {
    job: false,
    trainingProgram: false,
    education: false,
    other: false,
  }

  const handleSubmit = (values: ReliabilityProps) => {
    const responses = []

    if (values.job) responses.push(JOB)
    if (values.trainingProgram) responses.push(TRAINING_PROGRAM)
    if (values.education) responses.push(EDUCATION)
    if (values.other) responses.push(OTHER)

    onSubmit({
      reliability: {
        response: responses,
      },
    })
  }

  return (
    <>
      <Heading variant={'h2'} color={'greyscale.900'}>
        First, we&apos;ll let employers know how dependable you are
      </Heading>
      <Formik onSubmit={handleSubmit} initialValues={initialValue}>
        {(props) => (
          <Form>
            <Stack gap={'1rem'}>
              <FormikCheckBox name="job" label={JOB} />
              <FormikCheckBox name="trainingProgram" label={TRAINING_PROGRAM} />
              <FormikCheckBox name="education" label={EDUCATION} />
              <FormikCheckBox name="other" label={OTHER} />
              <Button variant={'primary'} isLoading={props.isSubmitting} type="submit">
                Next
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  )
}
