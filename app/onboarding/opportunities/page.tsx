'use client'

import FormikCheckBox from '@/components/FormikCheckbox'
import { Heading } from '@/components/Heading'
import { useIndustries } from '@/hooks/useIndustries'
import { Button, Stack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { Text } from '../../components/Text.component'
import BypassLink from '../components/BypassLink'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'

type OpportunitiesForm = {
  [key: string]: boolean
}

export default function Opportunities() {
  const onboarding = useOnboardingMutation()
  const { data: industries = [] } = useIndustries()
  const initialValue: OpportunitiesForm = {}

  const handleSubmit = (form: OpportunitiesForm) => {
    onboarding.mutate({ opportunityInterests: { response: Object.keys(form) } })
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        What opportunities interest you?
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        We&apos;ll send you new opportunities as we find them for you!
      </Text>
      <Formik onSubmit={handleSubmit} initialValues={initialValue}>
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
              {industries.map((i, index) => (
                <FormikCheckBox
                  key={index}
                  name={i}
                  label={i[0].toLocaleUpperCase() + i.slice(1)}
                />
              ))}
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
