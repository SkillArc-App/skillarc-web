import { Job } from '@/common/types/Job'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { Flex } from '@chakra-ui/react'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
import { Benefits } from './sections/postingSections/Benefits'
import { CareerJourney } from './sections/postingSections/CareerJourney'
import { EmployerSummary } from './sections/postingSections/EmployerSummary'
import { JobPhotos } from './sections/postingSections/JobPhotos'
import { JobTitleCard } from './sections/postingSections/JobTitleCard'
import { LearnedSkills } from './sections/postingSections/LearnedSkills'
import { Requirements } from './sections/postingSections/Requirements'
import { Responsibilities } from './sections/postingSections/Responsibilities'
import { Testimonials } from './sections/postingSections/Testimonials'
import { WhatToExpect } from './sections/postingSections/WhatToExpect'

interface SingleJobPostingProps {
  job: Job
}

export const SingleJobPosting = ({ job }: SingleJobPostingProps) => {
  const [startedView, setStartedViewing] = useState(false)
  const [hitBottom, setHitBottom] = useState(false)

  const trackScrollAnalytics = useCallback(() => {
    if (typeof window !== 'undefined' && document) {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= scrollableHeight && !hitBottom) {
        setHitBottom(true)
        FrontendAnalyticsService.track('Job-bottom-reached', { jobId: job.id, job })
      }
    }
  }, [hitBottom, job])

  useEffect(() => {
    if (typeof window !== 'undefined' && document) {
      document.addEventListener('scroll', throttle(trackScrollAnalytics, 250))
    }
  }, [trackScrollAnalytics])

  useEffect(() => {
    if (!startedView) {
      setStartedViewing(true)
      FrontendAnalyticsService.timeEvent('Job-viewed')
    }
  }, [startedView])

  return (
    <Flex flexWrap="wrap" w="100%" bg="#F8F9FA">
      <JobPhotos job={job} />
      <Flex flexWrap="wrap" w="100%" p="1rem" pb={'6rem'} marginTop="-3.5rem" gap="1rem" zIndex="1">
        <JobTitleCard job={job} />
        {job.employmentTitle && job.location && <EmployerSummary job={job} />}
        {job.requirementsDescription && <Requirements job={job} />}
        {job.employmentType && <WhatToExpect job={job} />}
        {job.benefitsDescription && <Benefits job={job} />}
        {job.responsibilitiesDescription && <Responsibilities job={job} />}
        {job.careerPaths.length > 0 && <CareerJourney job={job} />}
        {job.learnedSkills.length > 0 && <LearnedSkills job={job} />}
        {job.testimonials.length > 0 && <Testimonials job={job} />}
      </Flex>
    </Flex>
  )
}
