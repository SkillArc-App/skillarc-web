import { User } from '@/common/types/User'
import { useJobData } from '@/frontend/hooks/useJobData'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { Flex, Spinner } from '@chakra-ui/react'
import throttle from 'lodash.throttle'
import { useEffect, useState } from 'react'
import { Benefits } from './sections/postingSections/Benefits'
import { CareerJourney } from './sections/postingSections/CareerJourney'
import { DesiredSkills } from './sections/postingSections/DesiredSkills'
import { EmployerSummary } from './sections/postingSections/EmployerSummary'
import { JobPhotos } from './sections/postingSections/JobPhotos'
import { LearnedSkills } from './sections/postingSections/LearnedSkills'
import { Requirements } from './sections/postingSections/Requirements'
import { Responsibilities } from './sections/postingSections/Responsibilities'
import { Testimonials } from './sections/postingSections/Testimonials'
import { WhatToExpect } from './sections/postingSections/WhatToExpect'

interface SingleJobPostingProps {
  jobId: string
  percentMatch?: number
  user?: User
}

export const SingleJobPosting = ({ jobId, percentMatch, user }: SingleJobPostingProps) => {
  const {
    getOneJob: { data, isLoading },
  } = useJobData(jobId as string)

  // analytics variables for tracking scrolling
  const [startedView, setStartedViewing] = useState(false)
  const [hitBottom, setHitBottom] = useState<string[]>([])
  const [hitBottomTracked, setHitBottomTracked] = useState<string[]>([])
  const inJobCycle = percentMatch !== undefined

  // track when the user hits the bottom of the page for analytics
  useEffect(() => {
    if (hitBottom.includes(jobId) && !hitBottomTracked.includes(jobId)) {
      setHitBottomTracked((prev) => [...prev, jobId])
      FrontendAnalyticsService.track('Job-bottom-reached', { jobId: jobId, job: data })
    }
  }, [data, hitBottom, hitBottomTracked, jobId])

  useEffect(() => {
    if (typeof window !== 'undefined' && document) {
      document.addEventListener('scroll', throttle(trackScrollAnalytics, 250))
    }
  })

  const trackScrollAnalytics = () => {
    if (typeof window !== 'undefined' && document) {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= scrollableHeight && !hitBottom.includes(jobId) && !isLoading) {
        setHitBottom((prev) => [...prev, jobId])
      }
    }
  }

  useEffect(() => {
    setStartedViewing(false)
  }, [jobId])

  // call mixpanel.time_event('Job-viewed') when the user first views the job posting
  useEffect(() => {
    if (!startedView) {
      setStartedViewing(true)
      FrontendAnalyticsService.timeEvent('Job-viewed')
    }
  }, [startedView])

  if (!data || isLoading) {
    return (
      <Flex
        bg="#F8F9FA"
        w="100vw"
        h="100vh"
        p="1rem"
        borderRadius=".25rem"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
        flexWrap="wrap"
        justifyContent="center"
        marginTop="1rem"
      >
        <Spinner
          color="primary.300"
          size="lg"
          alignSelf="center"
          justifySelf="center"
          bg="#F8F9FA"
        />
      </Flex>
    )
  } else {
    return (
      <Flex flexWrap="wrap" w="100%" bg="#F8F9FA">
        <JobPhotos data={data} />
        <Flex
          flexWrap="wrap"
          w="100%"
          p="1rem"
          pb={'6rem'}
          marginTop="-3.5rem"
          gap="1rem"
          zIndex="1"
        >
          {data.employer && data.desiredSkills && data.desiredSkills.length > 0 && (
            <DesiredSkills
              data={data}
              profileSkills={user?.profile?.profileSkills}
              percentMatch={percentMatch}
              profileCertifications={user?.profile?.profileCertifications}
            />
          )}
          {data.employment_title && data.location && <EmployerSummary data={data} />}
          {data.requirements_description && <Requirements data={data} />}
          {data.employment_type && <WhatToExpect data={data} />}
          {data.benefits_description && <Benefits data={data} />}
          {data.responsibilities_description && <Responsibilities data={data} />}
          {data.careerPaths && data.careerPaths.length > 0 && <CareerJourney data={data} />}
          {data.learnedSkills && data.learnedSkills.length > 0 && <LearnedSkills data={data} />}
          {data.testimonials.length > 0 && <Testimonials data={data} />}
        </Flex>
      </Flex>
    )
  }
}
