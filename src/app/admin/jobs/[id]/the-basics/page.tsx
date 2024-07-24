'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { LoadingPage } from '@/app/components/Loading'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { put } from '@/frontend/http-common'
import { EditIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Link, Stack, useDisclosure } from '@chakra-ui/react'
import NextLink from 'next/link'
import ReactMarkdown from 'react-markdown'
import { JobBasics, JobBasicsModal } from '../../components/JobModal'

const TheBasicsPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const token = useAuthToken()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const onSubmit = async (job: Partial<JobBasics>) => {
    if (!token) return

    await put(
      `/admin/jobs/${id}`,
      {
        category: job.category,
        employerId: job.employerId,
        employmentTitle: job.employmentTitle,
        location: job.location,
        employmentType: job.employmentType,
        benefits_description: job.benefitsDescription,
        responsibilitiesDescription: job.responsibilitiesDescription,
        requirementsDescription: job.requirementsDescription,
        workDays: job.workDays,
        schedule: job.schedule,
        hideJob: job.hideJob,
      },
      token,
    )
    refetchJob()
    onClose()
  }

  if (!job) return <LoadingPage />

  const initialValue = {
    category: job.category,
    employerId: job.employer.id,
    employmentTitle: job.employmentTitle,
    location: job.location,
    employmentType: job.employmentType,
    benefitsDescription: job.benefitsDescription,
    responsibilitiesDescription: job.responsibilitiesDescription,
    requirementsDescription: job.requirementsDescription,
    workDays: job.workDays,
    schedule: job.schedule,
    hideJob: job.hideJob,
  }

  return (
    <Stack m={'1rem'} spacing={'1rem'}>
      <Flex>
        <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
          edit
        </Button>
      </Flex>
      <Box>
        <b>Category</b>: {job.category}
      </Box>
      <Box>
        <b>Employer</b>:{' '}
        <Link href={`/admin/employers/${job.employer.id}`} as={NextLink}>
          {job.employer?.name}
        </Link>
      </Box>
      <Box>
        <b>Employment Title</b>: {job.employmentTitle}
      </Box>
      <Box>
        <b>Location</b>: {job.location}
      </Box>
      <Box>
        <b>Employment Type</b>: {job.employmentType}
      </Box>
      <Box>
        <b>Benefits Description</b>:<ReactMarkdown>{job.benefitsDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Responsibilities Description</b>:
        <ReactMarkdown>{job.responsibilitiesDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Requirements Description</b>:
        <ReactMarkdown>{job.requirementsDescription ?? ''}</ReactMarkdown>
      </Box>
      <Box>
        <b>Work Days</b>: {job.workDays}
      </Box>
      <Box>
        <b>Schedule</b>: {job.schedule}
      </Box>
      <Box>
        <b>Hidden</b>: {job.hideJob ? 'Yes' : 'No'}
      </Box>
      <JobBasicsModal
        title="Edit Job"
        isOpen={isOpen}
        onClose={onClose}
        initialValue={initialValue}
        onSubmit={onSubmit}
      />
    </Stack>
  )
}

export default TheBasicsPage
