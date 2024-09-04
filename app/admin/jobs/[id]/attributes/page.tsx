'use client'

import { useAdminJob } from '@/admin/hooks/useAdminJob'
import { AdminJobAttribute } from '@/common/types/Job'
import { IdParams } from '@/common/types/PageParams'
import DataTable from '@/components/DataTable'
import FormObserver from '@/components/FormObserver'
import FormikMultiSelect from '@/components/FormikMultiSelect'
import FormikSelect from '@/components/FormikSelect'
import { useAttributes } from '@/hooks/useAttributes'
import { useAuthToken } from '@/hooks/useAuthToken'
import { destroy, post, put } from '@/http-common'
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

  const { data: attributes } = useAttributes()

  const [activeAttribute, setActiveAttribute] = useState(attributes?.at(0))

  useEffect(() => {
    if (attributes) {
      setActiveAttribute(attributes.at(0))
    }
  }, [attributes])

  const options = Object.entries(activeAttribute?.set ?? {}).map(([id, label]) => {
    return { value: id, label: label }
  })

  const [initialValue, setInitialValue] = useState<FormInputType>({
    attributeId: '',
    acceptibleSet: '',
  })

  const handleSave = async (values: FormInputType) => {
    console.log(values)
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

  const attributeValues = (ids: string[], options: Dictionary<string> = {}) => {
    return Object.entries(options).reduce((options, [id, label]) => {
      if (ids.includes(id)) {
        options.push(label)
      }

      return options
    }, [] as string[])
  }

  const handleEdit = (jobAttribute: AdminJobAttribute) => {
    const attribute = attributes?.find((attribute) => attribute.id === jobAttribute.attributeId)
    const acceptableSet = attributeValues(jobAttribute.attributeValueIds, attribute?.set).join(', ')

    setInitialValue({
      id: jobAttribute.id,
      attributeId: jobAttribute.attributeId,
      acceptibleSet: acceptableSet,
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
    columnHelper.accessor('attributeId', {
      header: 'Name',
      filterFn: 'includesString',
      cell: (row) => {
        const attributeName =
          attributes?.find((attribute) => attribute.id === row.getValue())?.name ?? 'Loading'

        return <Link onClick={() => handleEdit(row.row.original)}>{attributeName}</Link>
      },
    }),
    columnHelper.accessor('attributeValueIds', {
      header: 'Acceptable Set',
      cell: (row) => {
        const attributeValueIds = row.getValue()
        const attribute = attributes?.find(
          (attribute) => attribute.id === row.row.original.attributeId,
        )

        return attributeValues(attributeValueIds, attribute?.set).join(', ')
      },
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
