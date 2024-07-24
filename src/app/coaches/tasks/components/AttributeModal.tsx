import { Attribute } from '@/app/common/types/Attribute'
import FormObserver from '@/app/components/FormObserver'
import FormikMultiSelect from '@/app/components/FormikMultiSelect'
import FormikSelect from '@/app/components/FormikSelect'
import { useAuthToken } from '@/app/hooks/useAuthToken'
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
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useState } from 'react'

export type AttributeForm = {
  attributeId: string
  values: { value: string; label: string }[]
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

  const [activeAttribute, setActiveAttribute] = useState(0)

  const options =
    attributes?.at(activeAttribute)?.set.map((a) => {
      return { value: a, label: a }
    }) ?? []

  const handleSubmit = async (value: {
    attributeId: string
    values: { value: string; label: string }[]
  }) => {
    if (!token) return

    await post(
      `/coaches/seekers/${seekerId}/attributes`,
      {
        attributeId: attributes?.at(parseInt(value.attributeId))?.id,
        values: value.values,
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
              onChange={(values) =>
                setActiveAttribute(parseInt((values as AttributeForm).attributeId))
              }
            />
            <ModalBody>
              <Stack>
                <FormikSelect
                  name="attributeId"
                  label="Attribute"
                  options={attributes?.map((a, index) => {
                    return { key: index.toString(), value: a.name }
                  })}
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
