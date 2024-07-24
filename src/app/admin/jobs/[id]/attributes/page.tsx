'use client'

import { useAdminAttributes } from '@/app/admin/hooks/useAdminAttributes'
import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { AdminJobAttribute } from '@/common/types/Job'
import { IdParams } from '@/common/types/PageParams'
import DataTable from '@/frontend/components/DataTable.component'
import FormObserver from '@/frontend/components/FormObserver'
import FormikMultiSelect from '@/frontend/components/FormikMultiSelect'
import FormikSelect from '@/frontend/components/FormikSelect'
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
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'

type FormInputType = {
  id?: string
  attributeId: string
  acceptibleSet: string
}

const AttributesPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const token = useAuthToken()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const { data: attributes } = useAdminAttributes()

  const [activeAttribute, setActiveAttribute] = useState(attributes?.at(0))

  useEffect(() => {
    if (attributes) {
      setActiveAttribute(attributes.at(0))
    }
  }, [attributes])

  const options = activeAttribute?.set.map((a) => {
    return { value: a, label: a }
  })

  const [initialValue, setInitialValue] = useState<FormInputType>({
    attributeId: '',
    acceptibleSet: '',
  })

  const handleSave = async (values: FormInputType) => {
    if (!token) return
    if (!job) return

    if (values.id) {
      await put(
        `/admin/jobs/${job.id}/job_attributes/${values.id}`,
        {
          attributeId: values.attributeId,
          acceptibleSet: values.acceptibleSet,
        },
        token,
      )
    } else {
      await post(
        `/admin/jobs/${job.id}/job_attributes`,
        {
          attributeId: values.attributeId,
          acceptibleSet: values.acceptibleSet,
        },
        token,
      )
    }

    await refetchJob()

    onClose()
  }

  const handleEdit = (jobAttribute: AdminJobAttribute) => {
    setInitialValue({
      id: jobAttribute.id,
      attributeId: jobAttribute.attributeId,
      acceptibleSet: jobAttribute.acceptibleSet.join('\n'),
    })

    onOpen()
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!job) return

    await destroy(`/admin/jobs/${job.id}/job_attributes/${id}`, token)

    await refetchJob()
  }

  const columnHelper = createColumnHelper<AdminJobAttribute>()
  const columns = [
    columnHelper.accessor('attributeName', {
      header: 'Name',
      filterFn: 'includesString',
      cell: (row) => <Link onClick={() => handleEdit(row.row.original)}>{row.getValue()}</Link>,
    }),
    columnHelper.accessor('acceptibleSet', {
      header: 'Acceptible Set',
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

  if (!attributes) return <></>
  if (!job) return <></>

  return (
    <>
      <Stack>
        <Box>
          <Button
            size={'xs'}
            variant={'solid'}
            colorScheme="green"
            onClick={() => {
              setInitialValue({
                attributeId: '',
                acceptibleSet: '',
              })
              onOpen()
            }}
          >
            + New Job Attribute
          </Button>
        </Box>
        <DataTable columns={columns} data={job.jobAttributes} />
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Job Attribute</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={initialValue} onSubmit={handleSave}>
            {(props) => {
              return (
                <Form>
                  <ModalBody>
                    <Stack spacing={2}>
                      <FormObserver
                        onChange={() => {
                          const attribute = attributes?.filter(
                            (a) => a.id === props.values.attributeId,
                          )[0]
                          setActiveAttribute(attribute)
                        }}
                      />
                      <FormikSelect
                        name="attributeId"
                        label="Attribute"
                        options={attributes.map((a) => {
                          return { key: a.id, value: a.name }
                        })}
                      />
                      <FormikMultiSelect
                        label="Acceptable Values"
                        name="acceptibleSet"
                        placeholder="Acceptible Set"
                        options={options ?? []}
                      />
                    </Stack>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="green" mr={3} isLoading={props.isSubmitting} type="submit">
                      Save
                    </Button>
                  </ModalFooter>
                </Form>
              )
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AttributesPage
