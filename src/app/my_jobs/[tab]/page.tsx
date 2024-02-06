'use client'

import { JobCard } from '@/app/components/JobCard'
import useApply from '@/app/jobs/hooks/useApply'
import { Maybe } from '@/common/types/maybe'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useJobMatchData } from '@/frontend/hooks/useJobMatchData'
import { post } from '@/frontend/http-common'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { OneMatchedJobPosting } from '../../jobs/page'

const MyJobs = () => {
  const router = useRouter()
  const params = useFixedParams('tab')
  const tab = params?.['tab']

  const { data, refetch } = useJobMatchData()

  const token = useAuthToken()
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

  const [activeJob, setActiveJob] = useState<Maybe<OneMatchedJobPosting>>(undefined)
  const { applyCopy, onApply } = useApply({
    job: activeJob,
    async onReadyToApply(job, token) {
      await FrontendJobInteractionsService.apply(job.id, token)

      FrontendAnalyticsService.track('Job-applied', {
        job: job,
        jobId: job.id,
      })
      refetch()
      onSharingModalOpen()
    },
  })

  const jobMatches = data?.matchedJobs ?? []
  const savedJobMatches = jobMatches.filter((jobMatch) => jobMatch.saved)
  const appliedJobMatches = jobMatches.filter((jobMatch) => jobMatch.applied)

  const onSaveClick = async (job: OneMatchedJobPosting) => {
    if (!token) {
      return
    }

    const saved = !job.saved

    if (saved) {
      await post(`seekers/${''}/jobs/${job.id}/save`, {}, token)
    } else {
      await post(`seekers/${''}/jobs/${job.id}/unsave`, {}, token)
    }

    refetch()
  }

  const index = (tab: Maybe<string>) => {
    if (tab === 'recently-viewed') return 0
    if (tab === 'saved') return 1
    if (tab === 'applied') return 2
    return 0
  }

  const onApplyOpen = (e: React.MouseEvent<HTMLButtonElement>, job: OneMatchedJobPosting) => {
    setActiveJob(job)
    e.stopPropagation()
    onApplyModalOpen()
  }

  return (
    <Box height={'100%'} width={'100%'} overflow={'scroll'}>
      <Box m={'1rem'}>
        <Stack>
          <Flex alignItems={'center'} justifyContent={'center'}>
            <Heading mt={'0.25rem'} color={'greyscale.900'} variant={'h2'}>
              My Jobs
            </Heading>
          </Flex>
          <Tabs align={'center'} index={index(tab)} variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab as={Link} href="/my_jobs/recently-viewed">
                Viewed
              </Tab>
              <Tab as={Link} href="/my_jobs/saved">
                Saved
              </Tab>
              <Tab as={Link} href="/my_jobs/applied">
                Applied
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <Stack gap={'1rem'} overflow={'scroll'}>
                  {jobMatches.map((jobMatch) => (
                    <JobCard
                      key={jobMatch.id}
                      job={jobMatch}
                      onApplyClick={(e) => onApplyOpen(e, jobMatch)}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch)}
                    />
                  ))}
                </Stack>
              </TabPanel>
              <TabPanel px={0}>
                <Stack gap={'1rem'} overflow={'scroll'}>
                  {savedJobMatches.map((jobMatch) => (
                    <JobCard
                      key={jobMatch.id}
                      job={jobMatch}
                      onApplyClick={(e) => onApplyOpen(e, jobMatch)}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch)}
                    />
                  ))}
                </Stack>
              </TabPanel>
              <TabPanel px={0}>
                <Stack gap={'1rem'} overflow={'scroll'}>
                  {appliedJobMatches.map((jobMatch) => (
                    <JobCard
                      key={jobMatch.id}
                      job={jobMatch}
                      onApplyClick={(e) => onApplyOpen(e, jobMatch)}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch)}
                    />
                  ))}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Box>
      <Modal isOpen={isSharingModalOpen} onClose={onSharingModalClose}>
        <ModalOverlay />
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Great work! 🎉</Heading>
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
                <Image src={activeJob.employer.logo_url} alt="employer logo" boxSize={'4rem'} />
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
              <Button variant={'primary'} onClick={onApply}>
                {applyCopy}
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

export default withAuthenticationRequired(MyJobs)
