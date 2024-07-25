import { GetOneProfileResponse } from '@/app/services/profile.service'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { FaGraduationCap } from 'react-icons/fa6'
import { Text } from '../../../components/Text.component'
import { ProfileBox } from './profileBox'

export const ProfileEducation = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  if (seeker.educationExperiences.length === 0 && !seeker.isProfileEditor) return <></>

  return (
    <ProfileBox
      title="Education"
      icon={FaGraduationCap}
      isProfileEditor={seeker.isProfileEditor}
      ctaHref={`${seeker.id}/edit/education/new`}
    >
      <Flex flexDir={'column'} gap="1rem" pt="1rem">
        {seeker.educationExperiences.map((educationExperiences, index) => {
          return (
            <Flex key={index}>
              <Flex flexDir={'column'} gap="0.5rem" flexGrow={1}>
                <Flex flexDir={'column'} gap="0.5rem">
                  <Text type="b2Bold" color="greyscale.600">
                    {educationExperiences.graduationDate}
                  </Text>
                  <Heading variant="h4" color={'greyscale.900'}>
                    {educationExperiences.organizationName}
                  </Heading>
                  <Text type="b2" color="greyscale.600">
                    GPA: {educationExperiences.gpa}
                  </Text>
                  <Text type="b2" whiteSpace={'pre-line'} color="greyscale.600">
                    {educationExperiences.activities}
                  </Text>
                </Flex>
                <Divider borderColor="greyscale.300" />
              </Flex>
              {seeker.isProfileEditor && (
                <Button
                  as={Link}
                  variant={'icon'}
                  color="greyscale.600"
                  href={`${seeker.id}/edit/education/${educationExperiences.id}`}
                >
                  <EditIcon />
                </Button>
              )}
            </Flex>
          )
        })}
      </Flex>
    </ProfileBox>
  )
}
