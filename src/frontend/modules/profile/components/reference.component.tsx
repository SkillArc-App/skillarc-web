import { useProfileData } from '@/frontend/hooks/useProfileData'
import { useRouter } from 'next/router'

import { Avatar, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { Text } from '../../../components/Text.component'
import { LoadingPage } from '@/frontend/components/Loading'

export const ProfileReferences = () => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data: profile },
  } = useProfileData(profileId as string)

  if (!profile) return <LoadingPage />

  return (
    <Flex
      w="100%"
      p="1rem"
      bg="greyscale.100"
      borderRadius="0.25rem"
      boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      direction="column"
      gap={2}
    >
      <Text type="overline" color="greyscale.700" pb={2}>
        REFERENCES
      </Text>
      {profile.reference.map((reference, index) => {
        return (
          <HStack align="top" gap={2} pt={1}>
            <Avatar />
            <VStack align="left" gap={2}>
              <Flex direction="column" gap={2}>
                <Heading variant="h4" color={'greyscale.900'}>
                  {reference.authorProfile.user.first_name} {reference.authorProfile.user.last_name}
                  , {reference.trainingProvider.name}
                </Heading>
                <Text type="b2" color="greyscale.600">
                  {reference.reference_text}
                </Text>
              </Flex>
            </VStack>
          </HStack>
        )
      })}
    </Flex>
  )
}
