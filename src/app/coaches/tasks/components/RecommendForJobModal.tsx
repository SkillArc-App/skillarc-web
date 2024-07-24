import { Form, Formik } from 'formik'

import FormikSelect from '@/app/components/FormikSelect'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useCoachJobOrders } from '../../hooks/useCoachJobOrders'

const RecommendForJobModal = ({
  seekerId,
  isOpen,
  onClose,
}: {
  seekerId: string
  isOpen: boolean
  onClose: () => void
}) => {
  const { data: jobOrders } = useCoachJobOrders()
  const toast = useToast()

  const initialValue = {
    jobOrderId: '',
  }

  const token = useAuthToken()

  const handleSubmit = async (value: { jobOrderId: string }) => {
    if (!token) return

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/coaches/job_orders/${value.jobOrderId}/recommend`,
      {
        seekerId,
      },
      token,
    ).then(() => {
      toast({
        position: 'top',
        title: 'Recommended successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
    })
  }

  if (!jobOrders) return <></>

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recommend for Job</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          <Form>
            <ModalBody>
              <Stack>
                <FormikSelect
                  name="jobOrderId"
                  label="Job Order"
                  options={jobOrders.map((o) => {
                    return { key: o.id, value: `${o.employmentTitle} - ${o.employerName}` }
                  })}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" type="submit">
                Recommend
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default RecommendForJobModal
