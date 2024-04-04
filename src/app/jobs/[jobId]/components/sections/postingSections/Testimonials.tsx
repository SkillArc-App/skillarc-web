import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { Job } from '@/frontend/services/jobs.service'
import { Avatar, Divider, Flex } from '@chakra-ui/react'

export const Testimonials = ({ job }: { job: Job }) => {
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
        😄 Who you&apos;ll work with
      </Heading>
      {job.testimonials.map((testimonial: any, index: number) => {
        return (
          <Flex w="100%" flexWrap="wrap" gap=".5rem" key={index}>
            <Text type="b1" color="greyscale.600">
              {testimonial.testimonial}
            </Text>
            <Flex flexDir="row" w="100%" alignItems="center" gap=".5rem">
              <Avatar size="sm" src={testimonial.photo_url ?? ''} />

              <Text type="b3" color="greyscale.900">
                {testimonial.name}, {testimonial.title} at {job.employer.name}
              </Text>
            </Flex>
            {index != job.testimonials.length - 1 && (
              <Divider color="greyscale.300" marginTop=".5rem" />
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
