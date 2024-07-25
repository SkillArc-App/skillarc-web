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
import FormikInput from 'app/components/FormikInput'
import FormikTextArea from 'app/components/FormikTextArea'
import { Employer } from 'app/services/employer.service'
import { Form, Formik } from 'formik'
import { useAllEmployers } from '../../hooks/useAllEmployerData'

type EmployerModalProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  initialValue: Partial<EmployerBasics>
  onSubmit: (job: Partial<EmployerBasics>) => void
}

export type EmployerBasics = Pick<Employer, 'name' | 'location' | 'bio' | 'logoUrl'>

export function EmployerModal({
  isOpen,
  title,
  onClose,
  initialValue,
  onSubmit,
}: EmployerModalProps) {
  const { data: employers } = useAllEmployers()

  if (!employers) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={onSubmit}>
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={2}>
                  <FormikInput<string> isRequired type="text" label="Name" name="name" />
                  <FormikInput<string> isRequired type="text" label="Logo URL" name="logoUrl" />
                  <FormikInput<string> isRequired type="text" label="Location" name="location" />
                  <FormikTextArea isRequired label="Bio" name="bio" />
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
