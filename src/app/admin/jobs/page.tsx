'use client'

import { LoadingPage } from '@/app/components/Loading'
import DataTable from '@/frontend/components/DataTable.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import { Badge, Box, Button, Checkbox, Link, Stack, useDisclosure } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useState } from 'react'
import { useAllAdminJobs } from '../hooks/useAllAdminJobs'
import { JobBasics, JobBasicsModal } from './components/JobModal'

export default function Jobs() {
  const { data: jobs, refetch: refetchJobs } = useAllAdminJobs()
  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [showHiddenJobs, setShowHiddenJobs] = useState(false)

  const token = useAuthToken()

  const handleSubmit = async (job: Partial<JobBasics>) => {
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

  const initialValue: Partial<JobBasics> = {}

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
      <JobBasicsModal
        title="New Job"
        isOpen={isOpen}
        onClose={onClose}
        initialValue={initialValue}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
