'use client'

import FormikCheckBox from '@/app/components/FormikCheckbox'
import { Button, Heading, Stack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'

const JOB = "I've had or currently have a job"
const TRAINING_PROGRAM = "I've attended a Training Program"
const EDUCATION = 'I have a High School Diploma / GED'

type ReliabilityProps = {
  job: boolean
  trainingProgram: boolean
  education: boolean
  other: boolean
}

export default function Reliability() {
  const initialValue: ReliabilityProps = {
    job: false,
    trainingProgram: false,
    education: false,
    other: false,
  }
  const onboarding = useOnboardingMutation()

  const handleSubmit = (values: ReliabilityProps) => {
    const responses = []

    if (values.job) responses.push(JOB)
    if (values.trainingProgram) responses.push(TRAINING_PROGRAM)
    if (values.education) responses.push(EDUCATION)

    onboarding.mutate({ reliability: { response: responses } })
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
