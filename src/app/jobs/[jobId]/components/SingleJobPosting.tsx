import { User } from '@/common/types/User'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import { Flex } from '@chakra-ui/react'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
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
  job: GetOneJobPosting
  percentMatch?: number
  user?: User
}

export const SingleJobPosting = ({ job, percentMatch, user }: SingleJobPostingProps) => {
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

  // call mixpanel.time_event('Job-viewed') when the user first views the job posting
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
        {job.employer && job.desiredSkills.length > 0 && (
          <DesiredSkills
            job={job}
            profileSkills={user?.profile?.profileSkills}
            percentMatch={percentMatch}
            profileCertifications={user?.profile?.profileCertifications}
          />
        )}
        {job.employment_title && job.location && <EmployerSummary job={job} />}
        {job.requirements_description && <Requirements job={job} />}
        {job.employment_type && <WhatToExpect job={job} />}
        {job.benefits_description && <Benefits job={job} />}
        {job.responsibilities_description && <Responsibilities job={job} />}
        {job.careerPaths.length > 0 && <CareerJourney job={job} />}
        {job.learnedSkills.length > 0 && <LearnedSkills job={job} />}
        {job.testimonials.length > 0 && <Testimonials job={job} />}
      </Flex>
    </Flex>
  )
}
