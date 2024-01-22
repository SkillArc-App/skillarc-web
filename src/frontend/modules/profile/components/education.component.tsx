import { useProfileData } from '@/frontend/hooks/useProfileData'
import { EditIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaGraduationCap } from 'react-icons/fa6'
import { Text } from '../../../components/Text.component'
import { ProfileBox } from './profileBox.component'

export const ProfileEducation = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string)

  return (
    <ProfileBox
      title="Education"
      icon={FaGraduationCap}
      onAddClick={() => {
        router.push({
          pathname: `${profileId}/editProfile`,
          query: { section: 'education' },
        })
      }}
    >
      <Flex flexDir={'column'} gap="1rem" pt="1rem">
        {data?.educationExperiences.map((educationExperiences: any, index: number) => {
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
                  <Text type="b2" color="greyscale.600">
                    {educationExperiences.activities}
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
                      query: {
                        section: 'education',
                        educationExperienceId: educationExperiences.id,
                      },
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
