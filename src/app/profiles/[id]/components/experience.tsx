import { Heading } from '@/app/components/Heading'
import { Text } from '@/app/components/Text.component'
import { GetOneProfileResponse } from '@/app/services/profile.service'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { FaSuitcase } from 'react-icons/fa6'
import { ProfileBox } from './profileBox'

const ProfileExperience = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  if (seeker.otherExperiences.length === 0 && !seeker.isProfileEditor) return <></>

  return (
    <ProfileBox
      title="Experience"
      icon={FaSuitcase}
      isProfileEditor={seeker.isProfileEditor}
      ctaHref={`${seeker.id}/edit/experience/new`}
    >
      <Flex flexDir={'column'} gap="1rem" pt="1rem">
        {seeker.otherExperiences.map((otherExperiences, index: number) => {
          return (
            <Flex key={index}>
              <Flex direction="column" w="100%" gap="0.5rem">
                <Flex direction="column" gap="0.5rem" w="100%">
                  {otherExperiences.isCurrent == true && (
                    <Text type="b3" color="greyscale.600">
                      Current
                    </Text>
                  )}
                  {otherExperiences.isCurrent == false && (
                    <Text type="b3" color="greyscale.600">
                      {otherExperiences.startDate} - {otherExperiences.endDate}
                    </Text>
                  )}

                  <Heading variant="h4" color={'greyscale.900'}>
                    {otherExperiences.organizationName}
                  </Heading>
                  <Text type="b2Bold" color="greyscale.600">
                    {otherExperiences.position}
                  </Text>

                  <Text type="b2" whiteSpace={'pre-line'} color="greyscale.600">
                    {otherExperiences.description}
                  </Text>
                </Flex>
                <Divider borderColor="greyscale.300" />
              </Flex>
              {seeker.isProfileEditor && (
                <Button
                  variant={'icon'}
                  as={Link}
                  color="greyscale.600"
                  href={`${seeker.id}/edit/experience/${otherExperiences.id}`}
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

export { ProfileExperience }
