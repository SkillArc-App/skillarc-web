'use client'

import useUserState, { UserState } from '@/app/jobs/hooks/useUserState'
import { industries } from '@/common/static/industries'
import { tags } from '@/common/static/tags'
import { SearchFilter, SearchJob, SearchValue, UtmParams } from '@/common/types/Search'
import { Maybe } from '@/common/types/maybe'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useDebounce } from '@/frontend/hooks/useDebounce'
import { useUser } from '@/frontend/hooks/useUser'
import { post } from '@/frontend/http-common'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
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
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { SearchJobCard } from '../components/SearchJobCard'
import SearchBar from './components/SearchBar'
import useApply from './hooks/useApply'
import { useJobSearch } from './hooks/useJobSearch'

type Action = 'apply' | 'pitch' | 'share' | ''

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

const Jobs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithRedirect } = useAuth0()

  const searchTerms = searchParams?.get('utm_term') ?? searchParams?.get('searchTerm') ?? ''
  let otherUtmParams: Partial<UtmParams> = {}

  let utm_source = searchParams?.get('utm_source')
  if (!!utm_source) {
    otherUtmParams['utmSource'] = utm_source
  }

  const activeJobId = searchParams?.get('activeJobId')
  const action = searchParams?.get('action') as Action

  const [searchValue, setSearchValue] = useState<SearchValue>({
    searchTerms,
    filters: {},
    otherUtmParams: otherUtmParams,
  })

  const setActiveJobIdAndRoute = (id: string, action: Action = '') => {
    router.replace(`/jobs?utm_term=${searchValue.searchTerms}&activeJobId=${id}&action=${action}`)
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

      setActiveJobIdAndRoute(job.id, 'share')

      refetch()
    },
  })

  const [elevatorPitch, setElevatorPitch] = useState<Maybe<string>>(activeJob?.elevatorPitch)

  useEffect(() => {
    setElevatorPitch(activeJob?.elevatorPitch)
  }, [activeJob])

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
      await post(`seekers/jobs/${job.id}/save`, {}, token)
    } else {
      await post(`seekers/jobs/${job.id}/unsave`, {}, token)
    }

    refetch()
  }

  const onElevatorPitchOpen = (job: SearchJob) => {
    setActiveJobIdAndRoute(job.id, 'pitch')
  }

  const onElevatorPitchSave = async () => {
    if (!token) return

    await post(`jobs/${activeJob?.id}/elevator_pitch`, { elevatorPitch }, token)

    await refetch()

    setActiveJobIdAndRoute('')
  }

  if (!jobs) return <LoadingPage />

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
                  setActiveJobIdAndRoute(job.id, 'apply')
                  e.stopPropagation()
                }}
                onAddElevatorPitchClick={() => onElevatorPitchOpen(job)}
                onSaveClick={() => onSaveClick(job)}
                key={index}
              />
            )
          })}
        </VStack>
      </VStack>
      <Modal isOpen={!!activeJob && action === 'share'} onClose={() => setActiveJobIdAndRoute('')}>
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
            <Button width={'100%'} variant={'primary'} onClick={() => setActiveJobIdAndRoute('')}>
              Back to Jobs
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={!!activeJob && action === 'apply'}
        onClose={() => {
          setActiveJobIdAndRoute('')
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
      <Modal isOpen={action === 'pitch'} onClose={() => setActiveJobIdAndRoute('')}>
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
    </Box>
  )
}

export default function Page() {
  return (
    <Box height={'100%'} width={'100%'}>
      <Suspense fallback={<LoadingPage />}>
        <Jobs />
      </Suspense>
    </Box>
  )
}
