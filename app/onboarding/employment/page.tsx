'use client'

import { Heading } from '@/components/Heading'
import { Button, Stack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { Text } from '../../components/Text.component'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'
import FormikInput from '@/components/FormikInput'
import FormikCheckBox from '@/components/FormikCheckbox'
import FormikTextArea from '@/components/FormikTextArea'
import BypassLink from '../components/BypassLink'

export type ExperienceResponseProps = {
  company?: string
  position?: string
  startDate?: string
  current?: boolean
  endDate?: string
  description?: string
}

export default function Employment() {
  const initialExperience: ExperienceResponseProps = {
    company: '',
    position: '',
    startDate: '',
    current: false,
    endDate: '',
    description: '',
  }

  const onboarding = useOnboardingMutation()

  const handleSubmit = (form: ExperienceResponseProps) => {
    const filteredForm = form.current ? { ...form, endDate: '' } : form
    onboarding.mutate({ experience: { response: [filteredForm] } })
  }

  function validation(values: ExperienceResponseProps): object {
    const errors: any = {}

    if (values.startDate && values.endDate && !values.current) {
      if (new Date(values.endDate).getTime() - new Date(values.startDate).getTime() < 0) {
        errors.endDate = 'Your end date is currently before your start date'
      }
    }

    if (values.startDate && !values.endDate && !values.current) {
      errors.endDate = 'You need an end date or indicate you currently work here'
    }

    return errors
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Experience
      </Heading>
      <Text>
        Tell us about your most important working or volunteering experience. You can add additional
        experiences later on.
      </Text>
      <Formik onSubmit={handleSubmit} validate={validation} initialValues={initialExperience}>
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
                label="Company/Organization"
                placeholder="i.e. Dunder Mifflin"
                name="company"
              />
              <FormikInput<string>
                isRequired
                type="text"
                label="Position"
                placeholder="i.e. Assistant"
                name="position"
              />
              <FormikInput<string> isRequired type="month" label="Start Date" name="startDate" />
              <FormikCheckBox name="current" label="I currently work here" />
              <FormikInput<string> type="month" label="End Date" name="endDate" />
              <FormikTextArea
                isRequired
                label="Description"
                placeholder="Responsibilities, skills, etc."
                name="description"
              />
              <Button variant={'primary'} isLoading={props.isSubmitting} type="submit">
                Next
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      <BypassLink />
    </>
  )
}
