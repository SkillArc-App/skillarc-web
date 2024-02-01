'use client'

import { JobCard } from '@/app/components/JobCard'
import { Maybe } from '@/common/types/maybe'
import { Text } from '@/frontend/components/Text.component'
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
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OneMatchedJobPosting } from '../../jobs/page'

const MyJobs = () => {
  const router = useRouter()
  const params = useFixedParams('tab')
  const tab = params?.['tab']

  const {
    jobMatchesQuery: { data, refetch },
  } = useJobMatchData()

  const [jobMatches, setJobMatches] = useState(data?.matchedJobs ?? [])
  const [savedJobMatches, setSavedJobMatches] = useState<OneMatchedJobPosting[]>([])
  const [appliedJobMatches, setAppliedJobMatches] = useState<OneMatchedJobPosting[]>([])

  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [applying, setApplying] = useState<boolean>(false)

  const [activeJob, setActiveJob] = useState<OneMatchedJobPosting | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (data) setJobMatches(data.matchedJobs)
  }, [data])

  useEffect(() => {
    if (jobMatches) setSavedJobMatches(jobMatches.filter((jobMatch) => jobMatch.saved))
  }, [jobMatches])

  useEffect(() => {
    if (jobMatches) setAppliedJobMatches(jobMatches.filter((jobMatch) => jobMatch.applied))
  }, [jobMatches])

  const onSaveClick = (jobId: string) => {
    const newJobMatches = jobMatches.map((jobMatch) => {
      if (jobMatch.id === jobId) {
        const saved = !jobMatch.saved

        if (saved) {
          post(`seekers/${''}/jobs/${jobId}/save`, {}, token)
        } else {
          post(`seekers/${''}/jobs/${jobId}/unsave`, {}, token)
        }
        return { ...jobMatch, saved }
      }
      return jobMatch
    })
    setJobMatches(newJobMatches)
  }

  const handleApply = () => {
    if (!activeJob) return
    if (!token) return

    FrontendJobInteractionsService.apply(activeJob.id, token).then(() => {
      FrontendAnalyticsService.track('Job-applied', {
        job: activeJob,
        jobId: activeJob.id,
      })
      setApplying(true)
      const newJobMatches = jobMatches.map((jobMatch) => {
        if (jobMatch.id === activeJob.id) {
          return { ...jobMatch, applied: true }
        }
        return jobMatch
      })
      setJobMatches(newJobMatches)
    })
  }

  const index = (tab: Maybe<string>) => {
    if (tab === 'recently-viewed') return 0
    if (tab === 'saved') return 1
    if (tab === 'applied') return 2
    return 0
  }

  const getModalContent = () => {
    if (applying) {
      return (
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
            <Button variant={'primary'} onClick={() => handleApply()}>
              Apply with SkillArc Profile
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
                      onApplyClick={(e) => {
                        setActiveJob(jobMatch)
                        e.stopPropagation()
                        onOpen()
                      }}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch.id)}
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
                      onApplyClick={() => {}}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch.id)}
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
                      onApplyClick={(e) => {
                        console.log('CLICK')
                      }}
                      onCardClick={() => router.push(`/jobs/${jobMatch.id}`)}
                      onSaveClick={() => onSaveClick(jobMatch.id)}
                    />
                  ))}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {modalContent}
      </Modal>
    </Box>
  )
}

export default withAuthenticationRequired(MyJobs)
