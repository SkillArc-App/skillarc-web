'use client'

import { SearchJobCard } from '@/app/components/SearchJobCard'
import useApply from '@/app/jobs/hooks/useApply'
import { useJobSearch } from '@/app/jobs/hooks/useJobSearch'
import { SearchJob } from '@/common/types/Search'
import { Maybe } from '@/common/types/maybe'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { post } from '@/frontend/http-common'
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function MyJobsClient() {
  const router = useRouter()
  const params = useFixedParams('tab')
  const tab = params?.['tab']

  const { data: jobs, refetch } = useJobSearch({
    searchTerms: '',
    filters: {},
    otherUtmParams: {},
  })

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

  const {
    isOpen: isElevatorPitchModalOpen,
    onOpen: onElevatorPitchModalOpen,
    onClose: onElevatorPitchModalClose,
  } = useDisclosure()

  const [activeJob, setActiveJob] = useState<Maybe<SearchJob>>()
  const [elevatorPitch, setElevatorPitch] = useState<Maybe<string>>()
  const { applyCopy, onApply } = useApply({
    job: activeJob,
    async onReadyToApply(job, token) {
      await FrontendJobInteractionsService.apply(job.id, token)

      await refetch()
      onSharingModalOpen()
    },
  })

  const jobMatches = jobs ?? []
  const savedJobMatches = jobMatches.filter((jobMatch) => jobMatch.saved)
  const appliedJobMatches = jobMatches.filter((jobMatch) => jobMatch.applicationStatus)

  useEffect(() => {
    setElevatorPitch(activeJob?.elevatorPitch)
  }, [activeJob])

  const onSaveClick = async (job: SearchJob) => {
    if (!token) {
      return
    }

    const saved = !job.saved

    if (saved) {
      await post(`seekers/jobs/${job.id}/save`, {}, token)
    } else {
      await post(`seekers/jobs/${job.id}/unsave`, {}, token)
    }

    refetch()
  }

  const onElevatorPitchSave = async () => {
    if (!token) {
      return
    }

    await post(`jobs/${activeJob?.id}/elevator_pitch`, { elevatorPitch }, token)

    await refetch()

    onElevatorPitchModalClose()
  }

  const index = (tab: Maybe<string>) => {
    if (tab === 'recently-viewed') return 0
    if (tab === 'saved') return 1
    if (tab === 'applied') return 2
    return 0
  }

  const onElevatorPitchOpen = (job: SearchJob) => {
    setActiveJob(job)
    onElevatorPitchModalOpen()
  }

  const onApplyOpen = (job: SearchJob) => {
    setActiveJob(job)
    onApplyModalOpen()
  }

  const jobElement = (job: SearchJob) => {
    return (
      <SearchJobCard
        key={job.id}
        job={job}
        onAddElevatorPitchClick={() => onElevatorPitchOpen(job)}
        onApplyClick={() => onApplyOpen(job)}
        onCardClick={() => router.push(`/jobs/${job.id}`)}
        onSaveClick={() => onSaveClick(job)}
      />
    )
  }

  return (
    <Stack>
      <Tabs align={'center'} index={index(tab)} variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab as={NextLink} href="/my-jobs/recently-viewed">
            Viewed
          </Tab>
          <Tab as={NextLink} href="/my-jobs/saved">
            Saved
          </Tab>
          <Tab as={NextLink} href="/my-jobs/applied">
            Applied
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Stack gap={'1rem'} overflow={'scroll'}>
              {jobMatches.map((jobMatch) => jobElement(jobMatch))}
            </Stack>
          </TabPanel>
          <TabPanel px={0}>
            <Stack gap={'1rem'} overflow={'scroll'}>
              {savedJobMatches.map((jobMatch) => jobElement(jobMatch))}
            </Stack>
          </TabPanel>
          <TabPanel px={0}>
            <Stack gap={'1rem'} overflow={'scroll'}>
              {appliedJobMatches.map((jobMatch) => jobElement(jobMatch))}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
              {activeJob?.employer?.logoUrl && (
                <Image src={activeJob.employer.logoUrl} alt="employer logo" boxSize={'4rem'} />
              )}

              <Box>
                <Text type={'b1Bold'}>{activeJob?.employmentTitle}</Text>
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
      <Modal isOpen={isElevatorPitchModalOpen} onClose={onElevatorPitchModalClose}>
        <ModalOverlay />
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Elevator Pitch</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={'1rem'}>
              <Text type={'b2'}>Take 1-2 sentences to explain why you applied to this job</Text>
              <Textarea
                placeholder="I applied to this job because..."
                value={elevatorPitch}
                onChange={(e) => setElevatorPitch(e.target.value)}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button width={'100%'} variant={'primary'} onClick={onElevatorPitchSave}>
              Let&apos;s Go!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default withAuthenticationRequired(MyJobsClient)
