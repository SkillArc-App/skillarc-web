import { Attribute } from '@/common/types/Attribute'
import FormObserver from '@/frontend/components/FormObserver'
import FormikMultiSelect from '@/frontend/components/FormikMultiSelect'
import FormikSelect from '@/frontend/components/FormikSelect'
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
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'

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
    attributeId: '0',
    values: [],
  }
  const token = useAuthToken()

  const [activeAttribute, setActiveAttribute] = useState(0)

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    attributes?.at(activeAttribute)?.set.map((a) => {
      return { value: a, label: a }
    }) ?? [],
  )

  console.log(workingValue)

  useEffect(() => {
    setOptions(
      attributes?.at(activeAttribute)?.set.map((a) => {
        return { value: a, label: a }
      }) ?? [],
    )
  }, [attributes, activeAttribute])

  const handleSubmit = async (value: {
    attributeId: string
    values: { value: string; label: string }[]
  }) => {
    if (!token) return

    console.log(value)

    await post(
      `/coaches/seekers/${seekerId}/attributes`,
      {
        attributeId: attributes?.at(parseInt(value.attributeId))?.id,
        value: value.values,
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
                <Field name="values" component={FormikMultiSelect} options={options} />
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
