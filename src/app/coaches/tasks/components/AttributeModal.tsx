import FormikSelect from '@/frontend/components/FormikSelect'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useCoachAttributes } from '../../hooks/useCoachAttributes'

const AttributeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const initialValue = {}

  const { data: attributes } = useCoachAttributes()

  const handleSubmit = () => {}

  if (!attributes) return <></>

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new attribute</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          <Form>
            <ModalBody>
              <Stack>
                <FormikSelect
                  name="attributeId"
                  label="Attribute"
                  options={attributes?.map((a) => {
                    return { key: a.id, value: a.name }
                  })}
                />
                <FormikSelect
                  name="attributeId"
                  label="Attribute"
                  options={attributes?.map((a) => {
                    return { key: a.id, value: a.name }
                  })}
                />
              </Stack>
            </ModalBody>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default AttributeModal
