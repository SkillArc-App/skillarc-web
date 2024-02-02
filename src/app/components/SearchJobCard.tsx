import { SearchJob } from '@/common/types/Search'
import { Text } from '@/frontend/components/Text.component'
import ToggleIcon from '@/frontend/modules/onBoarding/components/ToggleIcon.component'
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

export const SearchJobCard = ({
  job,
  onCardClick,
  onApplyClick,
  onSaveClick,
}: {
  job: SearchJob
  onCardClick: () => void
  onApplyClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onSaveClick: (jobId: string) => void
}) => {
  const startingPay = () => {
    if (!job.startingPay) {
      return ''
    }

    const { employmentType, upperLimit, lowerLimit } = job.startingPay

    if (employmentType === 'salary') {
      return `$${lowerLimit / 1000}k - $${upperLimit / 1000}k ${employmentType}`
    } else {
      return `$${lowerLimit} - $${upperLimit} ${employmentType}`
    }
  }

  const steps = [
    { title: 'Application Sent' },
    { title: 'Introduction Sent' },
    { title: 'Interview in Progress' },
  ]

  const applicationStep = () => {
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
        <ToggleIcon isBookmarked={job.saved} onClick={() => onSaveClick(job.id)} />
      </Flex>
      <Flex flexWrap={'wrap'} gap={'0.5rem'}>
        {job.tags.map((tag, index) => (
          <Tag key={index} variant="outline" colorScheme="gray" borderRadius="full">
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Flex>
      <Flex>
        <Center fontWeight={'bold'} color={'green.500'}>
          {startingPay()}
        </Center>
        <Spacer />
        {!job.applicationStatus && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onApplyClick(e)
            }}
            variant={'primary'}
          >
            Apply
          </Button>
        )}
      </Flex>
      {job.applicationStatus && (
        <Stack>
          <Stepper size="sm" index={applicationStep() + 1} colorScheme={'green'} gap="0">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} />
                </StepIndicator>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Flex>
            <Text>
              <b>{steps[applicationStep()].title}</b>
            </Text>
          </Flex>
        </Stack>
      )}
    </Stack>
  )
}
