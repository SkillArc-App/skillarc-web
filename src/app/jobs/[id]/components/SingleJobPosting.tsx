import { Job } from '@/app/common/types/Job'
import { Flex } from '@chakra-ui/react'
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
