import FormikSelect from '@/components/FormikSelect'
import { useAuthToken } from '@/hooks/useAuthToken'
import { get } from '@/http-common'
import { useOrdersQuery } from '@/orders/hooks/useOrdersQuery'
import { AnswersRequest, Questions } from '@/screeners/types'
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

interface ScreenerSelectProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (result: Omit<AnswersRequest, 'personId'>) => void
}

const ScreenerSelectModal = ({ isOpen, onClose, onSubmit }: ScreenerSelectProps) => {
  const { data: orders = [] } = useOrdersQuery()
  const token = useAuthToken()

  const options = orders
    .filter((order) => !!order.screenerQuestionsId)
    .map((order) => ({
      key: order.id,
      value: `${order.employerName} ${order.employmentTitle}`,
    }))
  const initialValue = { id: '' }

  const wrappedSubmit = async ({ id }: { id: string }) => {
    if (!token) {
      return
    }

    const order = orders.find((order) => order.id === id)
    const result = (
      await get<Questions>(`screeners/questions/${order!.screenerQuestionsId}`, token)
    ).data

    result.questions

    onSubmit({
      title: `${order?.employerName} ${order?.employmentTitle}: ${new Date().toLocaleString()}`,
      questionResponses: result.questions.map((question) => ({
        question,
        response: '',
      })),
      screenerQuestionsId: order!.screenerQuestionsId,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80%">
        <ModalHeader>Select Screener</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={wrappedSubmit}>
          <Form>
            <ModalBody>
              <VStack spacing={2} width={'100%'}>
                <FormikSelect name="id" label="Job Order Screener" options={options} />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" type="submit" isLoading={false}>
                Next
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default ScreenerSelectModal
