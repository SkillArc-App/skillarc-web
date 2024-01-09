import { Employer } from '@/common/types/Employer'
import { MasterCertification, MasterSkill } from '@/common/types/Profile'
import { Text } from '@/frontend/components/Text.component'
import { userCanSeeJobs } from '@/frontend/helpers/seeJobRequirements'
import { useJobMatchData } from '@/frontend/hooks/useJobMatchData'
import { useUser } from '@/frontend/hooks/useUser'
import { post } from '@/frontend/http-common'
import { JobCard } from '@/frontend/modules/onBoarding/components/JobCard.component'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import {
  Box,
  Button,
  Flex,
  HStack,
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
  Tag,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

export default function jobs() {
  const router = useRouter()
  const [matchedJobArray, setMatchedJobArray] = useState<OneMatchedJobPosting[]>([])

  const [activeJob, setActiveJob] = useState<OneMatchedJobPosting | null>(null)

  const { data: user, isLoading: userIsLoading } = useUser()
  const {
    jobMatchesQuery: { data: jobMatches, refetch },
  } = useJobMatchData()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [constructionFilter, setConstructionFilter] = useState<boolean>(true)
  const [manufacturingFilter, setManufacturingFilter] = useState<boolean>(true)
  const [healthcareFilter, setHealthcareFilter] = useState<boolean>(true)

  const { getAccessTokenSilently, isLoading } = useAuth0()
  const [token, setToken] = useState<string>('')

  const setConstructionFilterAndTrack = (value: boolean) => {
    FrontendAnalyticsService.track('Job-filter', {
      filter: 'construction',
      value,
    })
    setConstructionFilter(value)
  }

  const setManufacturingFilterAndTrack = (value: boolean) => {
    FrontendAnalyticsService.track('Job-filter', {
      filter: 'manufacturing',
      value,
    })
    setManufacturingFilter(value)
  }

  const setHealthcareFilterAndTrack = (value: boolean) => {
    FrontendAnalyticsService.track('Job-filter', {
      filter: 'healthcare',
      value,
    })
    setHealthcareFilter(value)
  }

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])
  // const router = useRouter()

  // check that user has necessary profile components
  // IF NOT send to profile page
  useEffect(() => {
    if (userIsLoading) return

    if (!user?.profile) {
      // router.push('/')
    } else if (!userCanSeeJobs(user)) {
      router.push(`/profiles/${user.profile.id}`)
    }
  }, [router, user, userIsLoading])

  // query job matches
  useEffect(() => {
    if (user?.id) {
      refetch()
    }
  }, [refetch, user])

  // set matchedJobArray
  useEffect(() => {
    if (jobMatches) {
      const { matchedJobs } = jobMatches
      setMatchedJobArray(matchedJobs)
    }
  }, [jobMatches, user])

  useEffect(() => {
    if (isOpen) return

    setApplying(false)
  }, [isOpen])

  useEffect(() => {
    if (!jobMatches) return
    const { matchedJobs } = jobMatches
    if (!matchedJobs) return

    const filtered = matchedJobs.filter((job: any) => {
      if (!job?.industry) return false

      if (job.industry.includes('construction') && constructionFilter) {
        return true
      }

      if (job.industry.includes('manufacturing') && manufacturingFilter) {
        return true
      }

      if (job.industry.includes('healthcare') && healthcareFilter) {
        return true
      }

      return false
    })
    setMatchedJobArray(filtered.sort((j: any) => j.percentMatch).reverse())
  }, [manufacturingFilter, constructionFilter, healthcareFilter, jobMatches])

  // TODO: replace setTimeouts with isLoading state conditions from the jobs query/algorithum

  const [applying, setApplying] = useState<boolean>(false)

  const onSaveClick = (jobId: string) => {
    const newJobMatches = matchedJobArray.map((jobMatch) => {
      if (jobMatch.id === jobId) {
        const saved = !jobMatch.saved

        if (saved) {
          post(`seekers/jobs/${jobId}/save`, {}, token)
        } else {
          post(`seekers/jobs/${jobId}/unsave`, {}, token)
        }
        return { ...jobMatch, saved }
      }
      return jobMatch
    })
    setMatchedJobArray(newJobMatches)
  }

  if (!matchedJobArray) return

  const handleApply = () => {
    if (!activeJob) return
    if (!token) return

    FrontendJobInteractionsService.apply(activeJob.id, token).then(() => {
      FrontendAnalyticsService.track('Job-applied', {
        job: activeJob,
        jobId: activeJob.id,
      })
      setApplying(true)
    })
  }

  const getModalContent = () => {
    if (applying) {
      return (
        <ModalContent m={'1rem'}>
          <ModalHeader>
            <Heading size={'xl'}>Great work, {user?.firstName}! 🎉</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            We&apos;re sharing your BlockTrain profile and contact info with{' '}
            <b>{activeJob?.employer.name}</b> to start the application process.
          </ModalBody>

          <ModalFooter>
            <Button width={'100%'} variant={'primary'} onClick={() => onClose()}>
              Back to Jobs
            </Button>
          </ModalFooter>
        </ModalContent>
      )
    }
    return (
      <ModalContent m={'1rem'}>
        <ModalHeader>
          <Heading size={'xl'}>Let&apos;s do this!</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={'1rem'}>
            {activeJob?.employer?.logo_url && (
              <Image src={activeJob.employer.logo_url} boxSize={'4rem'} alt='Employer Logo' />
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
            <Button variant={'primary'} onClick={() => handleApply()}>
              Apply with Blocktrain Profile
            </Button>

            <Link as={NextLink} href={`/jobs/${activeJob?.id}`}>
              <Button width={'100%'}>See Full Job Posting</Button>
            </Link>
          </Stack>
        </ModalFooter>
      </ModalContent>
    )
  }

  const modalContent = getModalContent()

  return (
    <Box height={'100%'} width={'100%'} overflow={'scroll'}>
      <Box m={'1rem'}>
        <Heading mb={'1.5rem'}>Find your perfect job 💼</Heading>
        <HStack gap={'0.5rem'} mb={'1rem'}>
          <Tag
            cursor={'pointer'}
            colorScheme={constructionFilter ? 'primary' : 'gray'}
            borderRadius={'full'}
            onClick={() => setConstructionFilterAndTrack(!constructionFilter)}
          >
            Construction
          </Tag>
          <Tag
            cursor={'pointer'}
            colorScheme={manufacturingFilter ? 'primary' : 'gray'}
            borderRadius={'full'}
            onClick={() => setManufacturingFilterAndTrack(!manufacturingFilter)}
          >
            Manufacturing
          </Tag>
          <Tag
            cursor={'pointer'}
            colorScheme={healthcareFilter ? 'primary' : 'gray'}
            borderRadius={'full'}
            onClick={() => setHealthcareFilterAndTrack(!healthcareFilter)}
          >
            Healthcare
          </Tag>
        </HStack>
        <VStack spacing={'1rem'}>
          {matchedJobArray?.map((mj, index) => {
            return (
              <JobCard
                job={mj}
                onCardClick={() => router.push(`/jobs/${mj.id}`)}
                onApplyClick={(e) => {
                  setActiveJob(mj)
                  e.stopPropagation()
                  onOpen()
                }}
                onSaveClick={() => onSaveClick(mj.id)}
                key={index}
              />
            )
          })}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {modalContent}
      </Modal>
    </Box>
  )
}
