import { GetOneProfileResponse } from '@/frontend/services/profile.service'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { FaPeopleCarryBox } from 'react-icons/fa6'
import { Text } from '../../../../frontend/components/Text.component'
import { ProfileBox } from './profileBox'

export const PersonalExperience = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  return (
    <ProfileBox
      title="Personal Experience"
      icon={FaPeopleCarryBox}
      isProfileEditor={seeker.isProfileEditor}
      ctaHref={`${seeker.id}/edit/personal_experience/new`}
    >
      <Flex flexDir={'column'} gap="1rem" pt="1rem">
        {seeker.personalExperience.map((personalExperience, index) => {
          return (
            <Flex key={index}>
              <Flex direction="column" w="100%" gap="0.5rem">
                <Flex direction="column" gap="0.5rem" w="100%">
                  {!personalExperience.endDate && (
                    <Text type="b3" color="greyscale.600">
                      Current
                    </Text>
                  )}
                  {personalExperience.endDate && (
                    <Text type="b3" color="greyscale.600">
                      {personalExperience.startDate} - {personalExperience.endDate}
                    </Text>
                  )}

                  <Heading variant="h4" color={'greyscale.900'}>
                    {personalExperience.activity}
                  </Heading>

                  <Text type="b2" color="greyscale.600">
                    {personalExperience.description}
                  </Text>
                </Flex>
                <Divider borderColor="greyscale.300" />
              </Flex>
              {seeker.isProfileEditor && (
                <Button
                  variant={'icon'}
                  color="greyscale.600"
                  as={Link}
                  href={`${seeker.id}/edit/personal_experience/${personalExperience.id}`}
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
