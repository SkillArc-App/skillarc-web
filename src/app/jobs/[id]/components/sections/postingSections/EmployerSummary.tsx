import { Job } from '@/app/common/types/Job'
import { Heading } from '@/app/components/Heading'
import { Text } from '@/app/components/Text.component'
import { Flex } from '@chakra-ui/react'

interface EmployerSummaryProps {
  job: Job
}

export const EmployerSummary = ({ job }: EmployerSummaryProps) => {
  return (
    <Flex
      bg="white"
      w="100%"
      p="1rem"
      borderRadius=".25rem"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      flexWrap="wrap"
    >
      <Heading type="h4" color="greyscale.700" w="100%">
        About Us
      </Heading>

      <Text type="b2" color="greyscale.600" marginTop="1rem" w="100%">
        {job.employer.bio}
      </Text>
    </Flex>
  )
}
