'use client'

import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import { LoadingPage } from '@/app/components/Loading'
import DataTable from '@/frontend/components/DataTable.component'
import FormikInput from '@/frontend/components/FormikInput'
import FormikSelect from '@/frontend/components/FormikSelect'
import FormikTextArea from '@/frontend/components/FormikTextArea'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import {
  Badge,
  Box,
  Button,
  Checkbox,
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
  VStack,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useState } from 'react'
import { useAllAdminJobs } from '../hooks/useAllAdminJobs'

type NewJob = {
  category: string
  employerId: string
  employmentTitle: string
  location: string
  employmentType: string
  benefitsDescription: string
  responsibilitiesDescription: string
  requirementsDescription: string
  workDays: string
  schedule: string
}

export default function Jobs() {
  const { data: jobs, refetch: refetchJobs } = useAllAdminJobs()
  const { data: employers } = useAllEmployers()

  const categoryOptions = [
    {
      value: 'marketplace',
      label: 'Marketplace',
    },
    {
      value: 'staffing',
      label: 'Staffing',
    },
  ]

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [showHiddenJobs, setShowHiddenJobs] = useState(false)

  const token = useAuthToken()

  const handleSubmit = async (job: Partial<NewJob>) => {
    if (!token) return

    await post(`/admin/jobs`, job, token)

    await refetchJobs()

    onClose()
  }

  const data = (jobs ?? [])
    .filter((job) => (showHiddenJobs ? true : !job.hideJob))
    .map((job) => {
      return {
        id: job.id,
        hidden: job.hideJob,
        title: job.employmentTitle,
        employer: job.employer.name,
        createdAt: new Date(job.createdAt).toDateString(),
      }
    })

  const columnHelper = createColumnHelper<{
    id: string
    hidden: boolean
    title: string
    employer: string
    createdAt: string
  }>()

  const initialValue: Partial<NewJob> = {}

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      filterFn: 'includesString',
      cell: (row) => (
        <Link href={`/admin/jobs/${row.row.original.id}`} as={NextLink}>
          {row.row.original.hidden ? (
            <>
              <Badge colorScheme="red">Hidden</Badge> {row.getValue()}
            </>
          ) : (
            row.getValue()
          )}
        </Link>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Seeker View',
      cell: (row) =>
        row.row.original.hidden ? (
          'Hidden'
        ) : (
          <Link href={`/jobs/${row.getValue()}`} as={NextLink}>
            Seeker View
          </Link>
        ),
    }),
    columnHelper.accessor('employer', {
      header: 'Employer',
      filterFn: 'includesString',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (row) => row.getValue(),
    }),
  ]

  if (!jobs) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Stack>
        <Box>
          <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
            + New Job
          </Button>
        </Box>
        <Checkbox isChecked={showHiddenJobs} onChange={() => setShowHiddenJobs(!showHiddenJobs)}>
          Show Hidden Jobs
        </Checkbox>

        <DataTable data={data} columns={columns} />
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Job</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={initialValue} onSubmit={handleSubmit}>
            {(props) => (
              <Form>
                <ModalBody>
                  <VStack spacing={2}>
                    <FormikSelect
                      label="Category"
                      name="category"
                      isRequired
                      options={
                        categoryOptions?.map((category) => ({
                          key: category.value,
                          value: category.label,
                        })) ?? []
                      }
                    />
                    <FormikSelect
                      label="Employer"
                      name="employerId"
                      isRequired
                      options={
                        employers?.map((employer) => ({
                          key: employer.id,
                          value: employer.name,
                        })) ?? []
                      }
                    />
                    <FormikInput<string>
                      isRequired
                      type="text"
                      label="Employment Title"
                      name="employmentTitle"
                    />
                    <FormikInput<string> isRequired type="text" label="Location" name="location" />
                    <FormikSelect
                      label="Employment Type"
                      name="employmentType"
                      isRequired
                      options={[
                        { key: 'FULLTIME', value: 'FULLTIME' },
                        { key: 'PARTTIME', value: 'PARTTIME' },
                      ]}
                    />
                    <FormikTextArea
                      isRequired
                      label="Benefits Description"
                      name="benefitsDescription"
                    />
                    <FormikTextArea
                      isRequired
                      label="Responsibilities Description"
                      name="responsibilitiesDescription"
                    />
                    <FormikTextArea
                      isRequired
                      label="Requirements Description"
                      name="requirementsDescription"
                    />
                    <FormikTextArea isRequired label="Work days" name="workDays" />
                    <FormikTextArea isRequired label="Schedule" name="schedule" />
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
    </Box>
  )
}
