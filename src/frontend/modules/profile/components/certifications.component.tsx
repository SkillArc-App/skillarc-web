import { Button, Divider, Flex } from '@chakra-ui/react'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '../../../components/Text.component'
import { useRouter } from 'next/router'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { useEffect, useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { GetOneProfileResponse } from '@/frontend/services/profile.service'

export const ProfileCertifications = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
    isMyProfile,
  } = useProfileData(profileId as string)

  const [profileData, setProfileData] = useState<GetOneProfileResponse>()
  useEffect(() => {
    if (data && data.profileCertifications) {
      const res = data as GetOneProfileResponse // Cast data to GetOneResponse type
      setProfileData(res)
    }
  }, [data])

  if (!data?.profileCertifications?.length || 0 > 0) return <></>

  return (
    <Flex
      w="100%"
      p="1rem"
      bg="greyscale.100"
      borderRadius="0.25rem"
      boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      direction="column"
    >
      <Flex w="100%" alignItems={'center'}>
        <Text type="overline" color="greyscale.700" w="100%">
          CERTIFICATIONS
        </Text>
        {isMyProfile && (
          <Button
            variant={'icon'}
            color="greyscale.600"
            onClick={() =>
              router.push({
                pathname: `${profileId}/editProfile`,
                query: { section: 'certifications' },
              })
            }
          >
            <EditIcon />
          </Button>
        )}
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap="1rem">
        {profileData &&
          profileData.profileCertifications.length > 0 &&
          profileData.profileCertifications.map((cert: any, index: number) => {
            return (
              <Flex w="100%" flexWrap="wrap" key={index}>
                <Heading type="h4" color="greyscale.700" w="100%">
                  {cert.masterCertification.certification}
                </Heading>
                {index != profileData.profileCertifications.length - 1 && (
                  <Divider borderColor="#DEE2E6" w="100%" marginTop="1rem" />
                )}
              </Flex>
            )
          })}
      </Flex>
    </Flex>
  )
}
