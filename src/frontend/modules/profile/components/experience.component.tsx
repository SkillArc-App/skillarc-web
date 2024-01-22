import { Heading } from '@/frontend/components/Heading.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaSuitcase } from 'react-icons/fa6'
import { Text } from '../../../components/Text.component'
import { ProfileBox } from './profileBox.component'

const ProfileExperience = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string)

  return (
    <ProfileBox
      title="Experience"
      icon={FaSuitcase}
      onAddClick={() => {
        router.push({
          pathname: `${profileId}/editProfile`,
          query: { section: 'experience' },
        })
      }}
    >
      <Flex flexDir={'column'} gap="1rem" pt="1rem">
        {data?.otherExperiences.map((otherExperiences, index: number) => {
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

                  <Text type="b2" color="greyscale.600">
                    {otherExperiences.description}
                  </Text>
                </Flex>
                <Divider borderColor="greyscale.300" />
              </Flex>
              {data.isProfileEditor && (
                <Button
                  variant={'icon'}
                  color="greyscale.600"
                  onClick={() =>
                    router.push({
                      pathname: `${profileId}/editProfile`,
                      query: { section: 'experience', otherExperienceId: otherExperiences.id },
                    })
                  }
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
