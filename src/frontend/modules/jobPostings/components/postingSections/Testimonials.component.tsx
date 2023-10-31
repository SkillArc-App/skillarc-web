import { Heading } from '@/frontend/components/Heading.component'
import { Flex, Avatar, Divider } from '@chakra-ui/react'
import {
  CareerPath,
  Employer,
  Job,
  JobPhoto,
  MasterCertification,
  MasterSkill,
  Testimonial,
} from '@prisma/client'
import { Text } from '../../../../components/Text.component'

type GetOneJobPosting = {
  employer: Employer
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
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  testimonials: Testimonial[]
} & Job
export const Testimonials = ({ data }: { data: GetOneJobPosting }) => {
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
        😄 Who you'll work with
      </Heading>
      {data?.testimonials.map((testimonial, index) => {
        return (
          <Flex w="100%" flexWrap="wrap" gap=".5rem" key={index}>
            <Text type="b1" color="greyscale.600">
              {testimonial.testimonial}
            </Text>
            <Flex flexDir="row" w="100%" alignItems="center" gap=".5rem">
              <Avatar size="sm" src={testimonial.photo_url ?? ''} />

              <Text type="b3" color="greyscale.900">
                {testimonial.name}, {testimonial.title} at {data.employer.name}
              </Text>
            </Flex>
            {index != data.testimonials.length - 1 && (
              <Divider color="greyscale.300" marginTop=".5rem" />
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
