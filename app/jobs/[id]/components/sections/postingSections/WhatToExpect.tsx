import { Flex } from '@chakra-ui/react'
import { Job } from 'app/common/types/Job'
import { Heading } from 'app/components/Heading'
import { Text } from 'app/components/Text.component'

export const WhatToExpect = ({ job }: { job: Job }) => {
  return (
    <Flex
      bg="white"
      w="100%"
      p="1rem"
      borderRadius=".25rem"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      flexWrap="wrap"
      gap="1rem"
    >
      <Heading type="h4" color="greyscale.700" w="100%">
        🤔 What to expect
      </Heading>
      <Flex w="100%" flexWrap="wrap" gap=".5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          EMPLOYMENT TYPE
        </Text>
        <Text type="b2" color="greyscale.600" marginBottom="0.5rem">
          {job?.employmentType == 'FULLTIME' ? 'Full-time' : 'Part-time'}
        </Text>
        {job && job.workDays && (
          <>
            <Text type="overline" color="greyscale.700" w="100%">
              WORK DAYS
            </Text>
            <Text type="b2" color="greyscale.600" marginBottom="0.5rem">
              {job.workDays}
            </Text>
          </>
        )}
        {job && job.schedule && (
          <>
            <Text type="overline" color="greyscale.700" w="100%">
              SCHEDULE
            </Text>
            <Text type="b2" color="greyscale.600">
              {job.schedule}
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  )
}
