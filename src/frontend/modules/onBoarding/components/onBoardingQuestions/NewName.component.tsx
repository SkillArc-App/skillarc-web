import { NameResponse } from '@/common/types/OnboardingResponse'
import FormInputField from '@/frontend/components/FormInputField'
import { Button, Stack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { Heading } from '../../../../components/Heading.component'
import { Text } from '../../../../components/Text.component'

type NewNameProps = {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
}

export const NewName = ({ onSubmit }: { onSubmit: (name: NameResponse) => void }) => {
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

    onSubmit({
      name: {
        response: formatted,
      },
    })
  }

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
              <Button variant={'primary'} mt={'1rem'} isLoading={props.isSubmitting} type="submit">
                Next
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  )
}
