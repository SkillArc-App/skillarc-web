'use client'

import { Button, Heading, Stack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { Text } from '../../components/Text.component'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'
import FormikInput from '@/components/FormikInput'
import FormikTextArea from '@/components/FormikTextArea'

export type EducationResponseProps = {
  org?: string
  title?: string
  gradYear?: string
  gpa?: string
  activities?: string
}

export default function Education() {
  const initialExperience: EducationResponseProps = {
    org: '',
    title: '',
    gradYear: undefined,
    gpa: undefined,
    activities: '',
  }

  const onboarding = useOnboardingMutation()

  const handleSubmit = (form: EducationResponseProps) => {
    onboarding.mutate({
      education: {
        response: [{ ...form, gpa: form.gpa?.toString(), gradYear: form.gradYear?.toString() }],
      },
    })
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Education
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        Tell us about your education experience highest education experience. You can add more later
        on.
      </Text>

      <Formik onSubmit={handleSubmit} initialValues={initialExperience}>
        {(props) => (
          <Form>
            <Stack
              p={'1rem'}
              bg={'white'}
              width={'100%'}
              borderRadius={'0.25rem'}
              boxShadow={'sm'}
              gap={'0.5rem'}
              mt={'0.5rem'}
            >
              <FormikInput<string>
                isRequired
                type="text"
                label="School/Organization"
                placeholder="i.e. Washington High School"
                name="org"
              />
              <FormikInput<string>
                type="text"
                label="Title"
                placeholder="i.e. High School Student"
                name="title"
              />
              <FormikInput<string>
                isRequired
                type="number"
                placeholder="2009"
                label="Graduation Year / Expected Graduation Year"
                name="gradYear"
              />
              <FormikInput<string> type="number" label="GPA" name="gpa" placeholder="2.8" />
              <FormikTextArea
                label="Activities"
                placeholder="Teams, clubs, other groups, etc."
                name="activities"
              />
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
