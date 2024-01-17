import { Heading } from '@/frontend/components/Heading.component'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import { Flex } from '@chakra-ui/react'
import { Text } from '../../../../components/Text.component'

export const WhatToExpect = ({ data }: { data: GetOneJobPosting }) => {
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
          {data?.employment_type == 'FULLTIME' ? 'Full-time' : 'Part-time'}
        </Text>
        {data && data.work_days && (
          <>
            <Text type="overline" color="greyscale.700" w="100%">
              WORK DAYS
            </Text>
            <Text type="b2" color="greyscale.600" marginBottom="0.5rem">
              {data.work_days}
            </Text>
          </>
        )}
        {data && data.schedule && (
          <>
            <Text type="overline" color="greyscale.700" w="100%">
              SCHEDULE
            </Text>
            <Text type="b2" color="greyscale.600">
              {data.schedule}
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  )
}
