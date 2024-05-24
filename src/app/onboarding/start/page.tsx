'use client'

import FormInputField from '@/frontend/components/FormInputField'
import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { post } from '@/frontend/http-common'
import { Button, Stack, useToast } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { Heading } from '../../../frontend/components/Heading.component'
import { Text } from '../../../frontend/components/Text.component'
import { useOnboardingQuery } from '../hooks/useOnboardingQuery'

type NewNameProps = {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
}

export default function Start() {
  const queryClient = useQueryClient()
  const { data, refetch, isLoading: isOnboardingLoading } = useOnboardingQuery()
  const toast = useToast()
  const router = useRouter()

  const createOnboarding = useAuthenticatedMutation(
    async (form: NewNameProps, token: string) => {
      return await post<void>(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`,
        { ...form },
        token,
      )
    },
    {
      onSuccess: (_) => {
        queryClient.invalidateQueries('onboarding_data')
        queryClient.invalidateQueries('me')
      },
      onError: () => {
        toast({
          title: 'You may already have an account with use. Try to login an alternative way',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      },
    },
  )

  const isLoading = createOnboarding.isLoading || isOnboardingLoading

  const initialValue: NewNameProps = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  }

  const handleSubmit = (values: NewNameProps) => {
    const d = new Date(values.dateOfBirth)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')

    const formatted = {
      ...values,
      dateOfBirth: `${month}/${day}/${year}`,
    }

    createOnboarding.mutate(formatted)
  }

  useEffect(() => {
    if (createOnboarding.isSuccess && data) {
      if (data.nextStep != 'start') {
        router.push(`/onboarding/${data.nextStep}`)
      } else {
        setTimeout(refetch, 500)
      }
    }
  }, [createOnboarding.isSuccess, data, refetch, router])

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        You have a bright future ahead! Let&apos;s get started!
      </Heading>
      <Text color={'greyscale.600'} type={'b2'} pt={'0.5rem'}></Text>
      <Formik initialValues={initialValue} onSubmit={handleSubmit}>
        {(props) => (
          <Form>
            <Stack>
              <FormInputField<string> isRequired type="text" label="First Name" name="firstName" />
              <FormInputField<string> isRequired type="text" label="Last Name" name="lastName" />
              <FormInputField<string>
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                isRequired
              />
              {/* format as month/day/year */}
              <FormInputField<string>
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                isRequired
              />
              <Button variant={'primary'} mt={'1rem'} isLoading={isLoading} type="submit">
                Next
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  )
}
