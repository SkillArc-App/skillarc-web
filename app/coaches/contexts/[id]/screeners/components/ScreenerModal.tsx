import FormikInput from '@/components/FormikInput'
import FormikTextArea from '@/components/FormikTextArea'
import { AnswersRequest } from '@/screeners/types'
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import { FieldArray, Form, Formik } from 'formik'

interface QuestionInterface {
  isOpen: boolean
  onClose: () => void
  onSubmit: (request: AnswersRequest) => void
  initialValue?: AnswersRequest
}

const ScreenerModal = ({ isOpen, onClose, initialValue, onSubmit }: QuestionInterface) => {
  if (!initialValue) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80%">
        <ModalHeader>Candidate Screener</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={onSubmit}>
          {({ values }) => (
            <Form>
              <ModalBody>
                <VStack spacing={2} width={'100%'}>
                  <FormikInput<string> isRequired type="text" label="Screener Title" name="title" />
                  <FieldArray name="questionResponses">
                    {() => (
                      <VStack width={'100%'}>
                        {values.questionResponses.map((questionResponses, index) => (
                          <HStack width={'100%'} key={index}>
                            <FormikTextArea
                              isRequired
                              name={`questionResponses.${index}.response`}
                              label={questionResponses.question}
                            />
                          </HStack>
                        ))}
                      </VStack>
                    )}
                  </FieldArray>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" type="submit" isLoading={false}>
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default ScreenerModal
