import { PartialRequired } from '@/common/types/partial-required'
import FormInputField from '@/frontend/components/FormInputField'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { SeekerLead, SubmittableSeekerLead } from '../../types'

interface NewLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (lead: SubmittableSeekerLead) => void
}

const isValid = (
  lead: Partial<SeekerLead>,
): lead is PartialRequired<SeekerLead, 'firstName' | 'lastName' | 'phoneNumber'> => {
  return !!lead.phoneNumber && !!lead.firstName && !!lead.lastName
}

const NewLeadModal = ({ isOpen, onClose, onSubmit }: NewLeadModalProps) => {
  const initialValue: Partial<SubmittableSeekerLead> = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  }

  const handleSubmit = (values: Partial<SeekerLead>) => {
    if (isValid(values)) {
      onSubmit({
        leadId: crypto.randomUUID(),
        firstName: values.firstName,
        lastName: values.lastName,
        email: !!values.email ? values.email : undefined,
        phoneNumber: values.phoneNumber,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Lead</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={2}>
                  <FormInputField<string>
                    isRequired
                    type="text"
                    label="First Name"
                    name="firstName"
                  />
                  <FormInputField<string>
                    isRequired
                    type="text"
                    label="Last Name"
                    name="lastName"
                  />
                  <FormInputField<string>
                    isRequired
                    type="tel"
                    label="Phone Number"
                    name="phoneNumber"
                  />
                  <FormInputField<string> type="email" label="Email" name="email" />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" mr={3} isLoading={props.isSubmitting} type="submit">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default NewLeadModal
