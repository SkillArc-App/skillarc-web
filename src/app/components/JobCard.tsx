import { Text } from '@/frontend/components/Text.component'

import { MasterCertification, MasterSkill } from '@/common/types/Profile'
import ToggleIcon from '@/frontend/modules/onBoarding/components/ToggleIcon.component'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spacer,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  Tag,
  TagLabel,
} from '@chakra-ui/react'

export type OneMatchedJobPosting = {
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
  elevatorPitch?: string
} & GetOneJobPosting

export const JobCard = ({
  job,
  onCardClick,
  onAddElevatorPitchClick,
  onApplyClick,
  onSaveClick,
}: {
  job: OneMatchedJobPosting
  onCardClick: () => void
  onAddElevatorPitchClick: () => void
  onApplyClick: () => void
  onSaveClick: (jobId: string) => void
}) => {
  const prettify = (dollars: string) => {
    const num = Number(dollars)
    if (num < 1000) {
      return `$${num}/hour`
    } else {
      return `$${num / 1000}k/year`
    }
  }

  const steps = [
    { title: 'Application Sent' },
    { title: 'Introduction Sent' },
    { title: 'Interview in Progress' },
  ]

  const applicationStep = (job: OneMatchedJobPosting) => {
    if (job.applicationStatus === 'Application Sent') {
      return 0
    } else if (job.applicationStatus === 'Introduction Sent') {
      return 1
    } else if (job.applicationStatus === 'Interview in Progress') {
      return 2
    } else {
      return 0
    }
  }

  return (
    <Stack
      cursor={'pointer'}
      p={'1rem'}
      bg={'white'}
      width={'100%'}
      role="listitem"
      aria-label={job.employmentTitle}
      borderRadius={'0.25rem'}
      boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.10)'}
      spacing={'1rem'}
      onClick={onCardClick}
    >
      <Flex gap={'1rem'}>
        {job.employer?.logoUrl && (
          <Image src={job.employer.logoUrl} alt="employer logo" boxSize={'4rem'} />
        )}

        <Box textAlign={'left'}>
          <Text type={'b1Bold'}>{job.employmentTitle}</Text>
          <Text type={'b1'}>{job.employer.name}</Text>
          <Text type={'b2'}>{job.location}</Text>
        </Box>
        <Spacer />
        <ToggleIcon isBookmarked={job.saved} onClick={(val) => onSaveClick(job.id)} />
      </Flex>
      <Flex flexWrap={'wrap'} gap={'0.5rem'}>
        {job.jobTag?.map((tag: any, index: number) => {
          return (
            <Tag key={index} variant="outline" colorScheme="gray" borderRadius="full">
              <TagLabel>{tag.tag.name}</TagLabel>
            </Tag>
          )
        })}
      </Flex>
      <Flex>
        <Center fontWeight={'bold'} color={'green.500'}>
          {job.careerPaths?.length > 0 &&
            `${prettify(job.careerPaths[0].lowerLimit)} - ${prettify(
              job.careerPaths[0].upperLimit,
            )}`}
        </Center>
        <Spacer />
        {!job.applied && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onApplyClick()
            }}
            variant={'primary'}
          >
            Apply
          </Button>
        )}
      </Flex>
      {job.applied && (
        <Stack>
          <Stepper size="sm" index={applicationStep(job) + 1} colorScheme={'green'} gap="0">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} />
                </StepIndicator>
                <StepSeparator />
                {/* <StepSeparator _horizontal={{ ml: '0' }} /> */}
              </Step>
            ))}
          </Stepper>
          <Flex>
            <Text>
              <b>{steps[applicationStep(job)].title}</b>
            </Text>
          </Flex>
          <Button
            onClick={(e) => {
              e.stopPropagation()

              onAddElevatorPitchClick()
            }}
          >
            {job.elevatorPitch ? 'Update' : 'Add'} an Elevator Pitch
          </Button>
          {job.elevatorPitch && (
            <Text>
              <b>Pitch</b>: {job.elevatorPitch}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  )
}
