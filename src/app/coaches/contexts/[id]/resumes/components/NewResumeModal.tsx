import { DocumentKind, ResumeRequest } from '@/app/documents/types'
import FormikCheckBox from '@/frontend/components/FormikCheckbox'
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
  onSubmit: (request: ResumeForm) => void
}

export type ResumeForm = {
  personId: string
  anonymized: boolean
  documentKind: DocumentKind
  drug: boolean
  background: boolean
}

const NewResumeModal = ({ personId, isOpen, onClose, onSubmit }: NewLeadModalProps) => {
  const initialValue: ResumeForm = {
    personId,
    anonymized: false,
    documentKind: DocumentKind.PDF,
    drug: true,
    background: true,
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
                  <FormikCheckBox name="drug" label="Drug Screen Passed?" />
                  <FormikCheckBox name="background" label="Background Check Cleared?" />
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
