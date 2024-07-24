'use client'

import { useCoachJobs } from '@/app/coaches/hooks/useCoachJobs'
import { useCoachSeekerData } from '@/app/coaches/hooks/useCoachSeekerData'
import { CoachJob } from '@/app/coaches/types'
import DataTable from '@/app/components/DataTable'
import { LoadingPage } from '@/app/components/Loading'
import { Text } from '@/app/components/Text.component'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import { CheckIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Link, Stack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { Suspense } from 'react'

const Jobs = (params: IdParams) => {
  return (
    <Stack width={'100%'}>
      <Suspense>
        <JobsTable {...params} />
      </Suspense>
    </Stack>
  )
}

const JobsTable = ({ params: { id } }: IdParams) => {
  const { data: jobs } = useCoachJobs()
  const { data: seeker, refetch: refetchSeeker } = useCoachSeekerData(id)
  const token = useAuthToken()

  const columnHelper = createColumnHelper<CoachJob>()

  const applicationIcon = (applicationStatus: string) => {
    if (applicationStatus == 'none') {
      return null
    }

    if (applicationStatus == 'hire') {
      return <CheckIcon boxSize={3} color={'green'} />
    }

    if (applicationStatus == 'pass') {
      return <CloseIcon boxSize={3} color={'red'} />
    }

    return <TimeIcon boxSize={3} color={'gray'} />
  }

  const recommendJob = async (jobId: string) => {
    if (!token) return
    if (!seeker) return

    await post(`/coaches/contexts/${id}/recommend_job`, { jobId }, token)

    refetchSeeker()
  }

  if (!jobs || !seeker) {
    return <LoadingPage />
  }

  const applicationStatus = (jobId: string) => {
    const application = seeker.applications.find((application) => application.jobId == jobId)

    if (!application) {
      return 'none'
    }

    return application.status
  }

  const columns = [
    columnHelper.accessor('employerName', {
      header: 'Employer',
      filterFn: 'includesString',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('employmentTitle', {
      header: 'Job Title',
      filterFn: 'includesString',
      cell: (row) => (
        <Link variant={'b2'} as={NextLink} href={`/jobs/${row.row.original.id}`}>
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Application',
      cell: (row) => {
        const status = applicationStatus(row.getValue())

        return (
          <HStack>
            {applicationIcon(status)}
            <Text variant={'b2'} color={'black'}>
              {status}
            </Text>
          </HStack>
        )
      },
    }),
    columnHelper.accessor('id', {
      header: 'Recommendations to Seeker',
      cell: (row) => {
        return (
          <Box>
            {seeker.jobRecommendations.includes(row.getValue()) ? (
              <i>Recommended</i>
            ) : (
              <Button onClick={() => recommendJob(row.getValue())} variant={'solid'} size={'sm'}>
                Recommend
              </Button>
            )}
          </Box>
        )
      },
    }),
  ]

  return <DataTable columns={columns} data={jobs} />
}

export default Jobs
