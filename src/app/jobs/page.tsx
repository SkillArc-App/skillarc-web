'use client'

import useUserState, { UserState } from '@/app/jobs/hooks/useUserState'
import { industries } from '@/common/static/industries'
import { tags } from '@/common/static/tags'
import { Employer } from '@/common/types/Employer'
import { MasterCertification, MasterSkill } from '@/common/types/Profile'
import { SearchFilter, SearchJob, SearchValue, UtmParams } from '@/common/types/Search'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useDebounce } from '@/frontend/hooks/useDebounce'
import { useUser } from '@/frontend/hooks/useUser'
import { post } from '@/frontend/http-common'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import {
  Box,
  Button,
  Divider,
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
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SearchJobCard } from '../components/SearchJobCard'
import SearchBar from './components/SearchBar'
import useApply from './hooks/useApply'
import { useJobSearch } from './hooks/useJobSearch'

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

// This is simply a shim until
// We setup an endpoint for the server to
// Tell the client what it can filter on
const filters: SearchFilter[] = [
  {
    key: 'industries',
    label: 'Industries',
    options: industries.map((i) => ({
      value: i,
      label: i[0].toLocaleUpperCase() + i.slice(1),
    })),
  },
  {
    key: 'tags',
    label: 'Tags',
    options: tags.map((t) => ({
      value: t,
      label: t,
    })),
  },
]

export default function Jobs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithRedirect } = useAuth0()

  const searchTerms = searchParams?.get('utm_term') ?? searchParams?.get('searchTerm') ?? ''
  let otherUtmParams: Partial<UtmParams> = {}

  let utm_source = searchParams?.get('utm_source')
  if (!!utm_source) {
    otherUtmParams['utm_source'] = utm_source
  }

  const [activeJobId, setActiveJobId] = useState<string>(searchParams?.get('activeJobId') ?? '')
  const [searchValue, setSearchValue] = useState<SearchValue>({
    searchTerms,
    filters: {},
    otherUtmParams: otherUtmParams,
  })

  const setActiveJobIdAndRoute = (id: string) => {
    router.replace(`/jobs?utm_term=${searchValue.searchTerms}&activeJobId=${id}`)
    setActiveJobId(id)
  }
  const setSearchValueAndRoute = (searchValue: SearchValue) => {
    router.replace(`/jobs?utm_term=${searchValue.searchTerms}&activeJobId=${activeJobId}`)
    setSearchValue(searchValue)
  }

  const debouncedSearchTerm = useDebounce(searchValue, 500)

  const { data: user } = useUser()
  const userState = useUserState()
  const { data: jobSearch, refetch } = useJobSearch(debouncedSearchTerm)
  const jobs = jobSearch ?? []
  const activeJob = jobs.find(({ id }) => id === activeJobId)

  const { applyCopy, onApply } = useApply({
    job: activeJob,
    onReadyToApply: async (job, token) => {
      await FrontendJobInteractionsService.apply(job.id, token)

      FrontendAnalyticsService.track('Job-applied', {
        job: job,
        jobId: job.id,
      })
      setActiveJobIdAndRoute('')
      onApplyModalClose()
      onSharingModalOpen()

      refetch()
    },
  })

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

  useEffect(() => {
    if (activeJob && (!isApplyModalOpen || !isSharingModalOpen)) {
      onApplyModalOpen()
    }
  }, [activeJob, isApplyModalOpen, isSharingModalOpen, onApplyModalOpen])

  const token = useAuthToken()

  const onSaveClick = async (job: SearchJob) => {
    if (userState == UserState.UnAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.href,
        },
      })
      return
    }

    if (!token) return

    if (!job.saved) {
      FrontendAnalyticsService.track('Job-saved', { job })
      await post(`seekers/jobs/${job.id}/save`, {}, token)
    } else {
      FrontendAnalyticsService.track('Job-unsave', { job })
      await post(`seekers/jobs/${job.id}/unsave`, {}, token)
    }

    refetch()
  }

  if (!jobs) return

  return (
    <Box height={'100%'} width={'100%'}>
      <VStack align={'start'} m={'1rem'}>
        <Heading mb={'1.5rem'}>Find your perfect job 💼</Heading>
        <SearchBar value={searchValue} filters={filters} onChange={setSearchValueAndRoute} />
        <Divider />
        <VStack spacing={'1rem'} role="list" width={'100%'}>
          {jobs?.map((job, index) => {
            return (
              <SearchJobCard
                job={job}
                onCardClick={() => router.push(`/jobs/${job.id}`)}
                onApplyClick={(e) => {
                  setActiveJobIdAndRoute(job.id)
                  e.stopPropagation()
                  onApplyModalOpen()
                }}
                onSaveClick={() => onSaveClick(job)}
                key={index}
              />
            )
          })}
        </VStack>
      </VStack>
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
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setActiveJobIdAndRoute('')
          onApplyModalClose()
        }}
      >
        <ModalOverlay />
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Let&apos;s do this!</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={'1rem'}>
              {activeJob?.employer?.logoUrl && (
                <Image src={activeJob.employer.logoUrl} boxSize={'4rem'} alt="Employer Logo" />
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
    </Box>
  )
}
