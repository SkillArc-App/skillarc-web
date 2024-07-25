'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { IdParams } from '@/app/common/types/PageParams'
import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { put } from '@/app/http-common'
import { EditIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Link, Stack, useDisclosure } from '@chakra-ui/react'
import NextLink from 'next/link'
import ReactMarkdown from 'react-markdown'
import { JobBasics, JobBasicsModal } from '../../components/JobModal'

const TheBasicsPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const token = useAuthToken()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const onSubmit = async (updatedJob: Partial<JobBasics>) => {
    if (!token || !job) return

    await put(
      `/admin/jobs/${id}`,
      {
        category: updatedJob.category,
        employerId: updatedJob.employerId,
        employmentTitle: updatedJob.employmentTitle,
        location: updatedJob.location,
        employmentType: updatedJob.employmentType,
        benefits_description: updatedJob.benefitsDescription,
        responsibilitiesDescription: updatedJob.responsibilitiesDescription,
        requirementsDescription: updatedJob.requirementsDescription,
        workDays: updatedJob.workDays,
        schedule: updatedJob.schedule,
        hideJob: updatedJob.hideJob,
        industry: job.industry,
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
