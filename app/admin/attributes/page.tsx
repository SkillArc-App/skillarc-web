'use client'

import { Attribute } from '@/common/types/Attribute'
import DataTable from '@/components/DataTable'
import FormikInput from '@/components/FormikInput'
import FormikTextArea from '@/components/FormikTextArea'
import { useAttributes } from '@/hooks/useAttributes'
import { useAuthToken } from '@/hooks/useAuthToken'
import { destroy, post, put } from '@/http-common'
import {
  Box,
  Button,
  HStack,
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
  Tag,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { FaRegTrashCan, FaX } from 'react-icons/fa6'

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
      set: Object.values(editVal.set).join('\n'),
      default: Object.values(editVal.default).join('\n'),
    })

    onOpen()
  }

  const handleDeleteServer = () => {
    alert('You cannot delete server managed attributes. Talk to eng.')
  }

  const handleDelete = async (id: string) => {
    if (!token) return

    if (window.confirm('Are you sure you want to delete this attribute?') === true) {
      await destroy(`/admin/attributes/${id}`, token)
    }

    refetch()
  }

  const columnHelper = createColumnHelper<Attribute>()

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      filterFn: 'includesString',
      cell: (row) => <Link onClick={() => handleEdit(row.row.original.id)}>{row.getValue()}</Link>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('machineDerived', {
      header: 'Server Managed',
      cell: (row) => (row.getValue() ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('set', {
      header: 'Set',
      cell: (row) => {
        return (
          <HStack>
            {Object.entries(row.getValue()).map(([id, label]) => {
              return <Tag key={id}>{label}</Tag>
            })}
          </HStack>
        )
      },
    }),
    columnHelper.accessor('default', {
      header: 'Default',
      cell: (row) => {
        return (
          <HStack>
            {Object.entries(row.getValue()).map(([id, label]) => {
              return <Tag key={id}>{label}</Tag>
            })}
          </HStack>
        )
      },
    }),
    columnHelper.accessor(() => {}, {
      header: 'Actions',
      cell: (row) => (
        <IconButton
          onClick={
            row.row.original.machineDerived
              ? handleDeleteServer
              : () => handleDelete(row.row.original.id)
          }
          aria-label="delete-attribute"
          variant={'ghost'}
          icon={row.row.original.machineDerived ? <FaX /> : <FaRegTrashCan />}
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
        `/admin/attributes/${initialValue.id}`,
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
        `/admin/attributes`,
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
                    <FormikInput<string> isRequired type="text" label="Name" name="name" />
                    <FormikInput<string> type="text" label="Description" name="description" />
                    <FormikTextArea isRequired label="Set (newline separated)" name="set" />
                    <FormikTextArea label="Default (newline separated)" name="default" />
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
