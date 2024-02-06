import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import { Flex } from '@chakra-ui/react'

interface EmployerSummaryProps {
  job: GetOneJobPosting
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
