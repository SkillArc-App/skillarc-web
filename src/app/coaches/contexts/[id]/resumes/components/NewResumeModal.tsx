import { DocumentKind, ResumeRequest } from '@/app/documents/types'
import FormikCheckBox from '@/frontend/components/FormikCheckbox'
import FormikInput from '@/frontend/components/FormikInput'
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

interface NewLeadModalProps {
  personId: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (request: ResumeRequest) => void
}

const NewResumeModal = ({ personId, isOpen, onClose, onSubmit }: NewLeadModalProps) => {
  const initialValue: ResumeRequest = {
    personId,
    anonymized: false,
    documentKind: DocumentKind.PDF,
    pageLimit: 1,
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate a New Resume</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={onSubmit}>
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={2}>
                  <FormikCheckBox name="anonymized" label="Anonymize Resume?" />
                  <FormikInput<number>
                    isRequired
                    type="number"
                    name="pageLimit"
                    min={1}
                    label="Page Limit"
                  />
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

export default NewResumeModal
