'use client'

import { JobCard } from '@/app/components/JobCard'
import { Employer } from '@/common/types/Employer'
import { MasterCertification, MasterSkill } from '@/common/types/Profile'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useJobMatchData } from '@/frontend/hooks/useJobMatchData'
import { useUser } from '@/frontend/hooks/useUser'
import { post } from '@/frontend/http-common'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
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
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type OneMatchedJobPosting = {
  employer: Employer
  learnedSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertificationId: string
    masterCertification: MasterCertification
  }[]
  jobInteractions?: {
    percentMatch?: number
    id?: string
  }
  saved: boolean
  applied: boolean
  applicationStatus?: string
} & GetOneJobPosting

export default function Jobs() {
  const router = useRouter()

  const [activeJob, setActiveJob] = useState<OneMatchedJobPosting | null>(null)

  const { data: user } = useUser()
  const { data: jobMatches, refetch } = useJobMatchData()
  const matchedJobArray = jobMatches?.matchedJobs ?? []

  const {
    isOpen: isApplyModalOpen,
    onOpen: onApplyModalOpen,
    onClose: onApplyModalClose,
  } = useDisclosure()
  const {
    isOpen: isSharingModalOpen,
    onOpen: onSharingModalOpen,
    onClose: onSharingModalClose,
  } = useDisclosure()

  const token = useAuthToken()

  const onSaveClick = async (jobId: string) => {
    const job = matchedJobArray.find(({ id }) => id === jobId)

    if (!token) return
    if (!job) return

    if (!job.saved) {
      FrontendAnalyticsService.track('Job-saved', { job })
      await post(`seekers/jobs/${jobId}/save`, {}, token)
    } else {
      FrontendAnalyticsService.track('Job-unsave', { job })
      await post(`seekers/jobs/${jobId}/unsave`, {}, token)
    }

    refetch()
  }

  const handleApply = async () => {
    if (!activeJob) return
    if (!token) return

    await FrontendJobInteractionsService.apply(activeJob.id, token)

    FrontendAnalyticsService.track('Job-applied', {
      job: activeJob,
      jobId: activeJob.id,
    })
    onApplyModalClose()
    onSharingModalOpen()

    refetch()
  }

  if (!matchedJobArray) return

  return (
    <Box height={'100%'} width={'100%'} overflow={'scroll'}>
      <Box m={'1rem'}>
        <Heading mb={'1.5rem'}>Find your perfect job 💼</Heading>
        <VStack spacing={'1rem'} role="list">
          {matchedJobArray?.map((matchedJob, index) => {
            return (
              <JobCard
                job={matchedJob}
                onCardClick={() => router.push(`/jobs/${matchedJob.id}`)}
                onApplyClick={(e) => {
                  setActiveJob(matchedJob)
                  e.stopPropagation()
                  onApplyModalOpen()
                }}
                onSaveClick={() => onSaveClick(matchedJob.id)}
                key={index}
              />
            )
          })}
        </VStack>
      </Box>
      <Modal isOpen={isSharingModalOpen} onClose={onSharingModalClose}>
        <ModalOverlay />
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Great work, {user?.firstName}! 🎉</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            We&apos;re sharing your SkillArc profile and contact info with{' '}
            <b>{activeJob?.employer.name}</b> to start the application process.
          </ModalBody>

          <ModalFooter>
            <Button width={'100%'} variant={'primary'} onClick={onSharingModalClose}>
              Back to Jobs
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isApplyModalOpen} onClose={onApplyModalClose}>
        <ModalOverlay />
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Let&apos;s do this!</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={'1rem'}>
              {activeJob?.employer?.logo_url && (
                <Image src={activeJob.employer.logo_url} boxSize={'4rem'} alt="Employer Logo" />
              )}

              <Box>
                <Text type={'b1Bold'}>{activeJob?.employment_title}</Text>
                <Text type={'b2'}>{activeJob?.employer.name}</Text>
                <Text type={'b3'}>{activeJob?.location}</Text>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Stack width={'100%'}>
              <Button variant={'primary'} onClick={handleApply}>
                Apply with SkillArc Profile
              </Button>

              <Link as={NextLink} href={`/jobs/${activeJob?.id}`}>
                <Button width={'100%'}>See Full Job Posting</Button>
              </Link>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
