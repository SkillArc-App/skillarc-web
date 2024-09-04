import { Attribute } from '@/common/types/Attribute'
import { Maybe } from '@/common/types/maybe'
import FormObserver from '@/components/FormObserver'
import FormikMultiSelect from '@/components/FormikMultiSelect'
import FormikSelect from '@/components/FormikSelect'
import { useAuthToken } from '@/hooks/useAuthToken'
import { post } from '@/http-common'
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
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useState } from 'react'

export type AttributeForm = {
  attributeId: string
  values: string[]
}

const AttributeModal = ({
  attributes,
  workingValue,
  isOpen,
  onClose,
  refetchSeeker,
  seekerId,
}: {
  attributes: Attribute[]
  workingValue?: AttributeForm
  isOpen: boolean
  onClose: () => void
  refetchSeeker: () => void
  seekerId: string
}) => {
  const initialValue: AttributeForm = workingValue ?? {
    attributeId: '',
    values: [],
  }
  const token = useAuthToken()

  const [activeAttributeId, setActiveAttributeId] = useState<Maybe<string>>(undefined)

  const activeAttribute = attributes.find(({ id }) => id === activeAttributeId)?.set ?? {}
  const options =
    Object.entries(activeAttribute).map(([id, label]) => ({ value: id, label: label })) ?? []

  const handleSubmit = async ({ attributeId, values }: AttributeForm) => {
    if (!token) return

    await post(
      `/coaches/seekers/${seekerId}/attributes`,
      {
        attributeId,
        attributeValueIds: values,
      },
      token,
    )

    await refetchSeeker()

    onClose()
  }

  if (!attributes) return <></>

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new attribute</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          <Form>
            <FormObserver
              onChange={(values: AttributeForm) => setActiveAttributeId(values.attributeId)}
            />
            <ModalBody>
              <Stack>
                <FormikSelect
                  name="attributeId"
                  label="Attribute"
                  options={attributes.map(({ id: key, name: value }) => ({ key, value }))}
                />
                <FormikMultiSelect
                  label="add a value"
                  name="values"
                  placeholder={'Add a value'}
                  options={options}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} type="submit">
                Save
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default AttributeModal
