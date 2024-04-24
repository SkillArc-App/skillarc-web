'use client'

import { Attribute } from '@/common/types/Attribute'
import DataTable from '@/frontend/components/DataTable.component'
import FormInputField from '@/frontend/components/FormInputField'
import FormTextAreaField from '@/frontend/components/FormTextAreaField'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { destroy, post, put } from '@/frontend/http-common'
import {
  Box,
  Button,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useAttributes } from '../hooks/useAttributes'

type FormInputType = {
  id?: string
  name: string
  description: string
  set: string
  default: string
}

const Attributes = () => {
  const { data: attributes, refetch } = useAttributes()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [initialValue, setInitialValue] = useState<FormInputType>({
    name: '',
    description: '',
    set: '',
    default: '',
  })

  const handleEdit = (id: string) => {
    const editVal = attributes?.find((attr) => attr.id === id)

    if (!editVal) return

    setInitialValue({
      id: editVal.id,
      name: editVal.name,
      description: editVal.description,
      set: editVal.set.join('\n'),
      default: editVal.default.join('\n'),
    })

    onOpen()
  }

  const handleDelete = async (id: string) => {
    if (!token) return

    if (window.confirm('Are you sure you want to delete this attribute?') === true) {
      await destroy(`${process.env.NEXT_PUBLIC_API_URL}/admin/attributes/${id}`, token)
    }

    refetch()
  }

  const columnHelper = createColumnHelper<Attribute>()

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (row) => <Link onClick={() => handleEdit(row.row.original.id)}>{row.getValue()}</Link>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('set', {
      header: 'Set',
      cell: (row) => row.getValue().join(', '),
    }),
    columnHelper.accessor('default', {
      header: 'Default',
      cell: (row) => row.getValue().join(', '),
    }),
    columnHelper.accessor(() => {}, {
      header: 'Actions',
      cell: (row) => (
        <IconButton
          onClick={() => handleDelete(row.row.original.id)}
          aria-label="delete-attribute"
          variant={'ghost'}
          icon={<FaRegTrashCan />}
        />
      ),
    }),
  ]

  const token = useAuthToken()

  const handleSave = async (values: FormInputType) => {
    if (!token) return

    const splitSet = values.set?.split('\n').map((item) => item.trim())
    const splitDefault = values.default?.split('\n').map((item) => item.trim())

    if (initialValue.id) {
      await put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/attributes/${initialValue.id}`,
        {
          name: values.name,
          description: values.description,
          set: splitSet,
          default: splitDefault,
        },
        token,
      )
    } else {
      await post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/attributes`,
        {
          name: values.name,
          description: values.description,
          set: splitSet,
          default: splitDefault,
        },
        token,
      )
    }

    await refetch()
    onClose()
  }

  return (
    <Stack>
      <Box>
        <Button
          size={'xs'}
          variant={'solid'}
          colorScheme="green"
          onClick={() => {
            setInitialValue({
              id: undefined,
              name: '',
              description: '',
              set: '',
              default: '',
            })
            onOpen()
          }}
        >
          + New Attribute
        </Button>
      </Box>
      <DataTable data={attributes ?? []} columns={columns} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Attribute</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={initialValue} onSubmit={handleSave}>
            {(props) => (
              <Form>
                <ModalBody>
                  <VStack spacing={2}>
                    <FormInputField<string> isRequired type="text" label="Name" name="name" />
                    <FormInputField<string> type="text" label="Description" name="description" />
                    <FormTextAreaField isRequired label="Set (newline separated)" name="set" />
                    <FormTextAreaField label="Default (newline separated)" name="default" />
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
    </Stack>
  )
}

export default Attributes
