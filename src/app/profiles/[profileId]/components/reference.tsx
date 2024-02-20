import { GetOneProfileResponse } from '@/frontend/services/profile.service'
import { Avatar, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { Text } from '../../../../frontend/components/Text.component'

export const ProfileReferences = ({ seeker }: { seeker: GetOneProfileResponse }) => {
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
      {seeker.reference.map((reference, index: number) => {
        return (
          <HStack align="top" gap={2} pt={1} key={index}>
            <Avatar />
            <VStack align="left" gap={2}>
              <Flex direction="column" gap={2}>
                <Heading variant="h4" color={'greyscale.900'}>
                  {reference.authorUser.firstName} {reference.authorUser.lastName}
                  , {reference.trainingProvider.name}
                </Heading>
                <Text type="b2" color="greyscale.600">
                  {reference.referenceText}
                </Text>
              </Flex>
            </VStack>
          </HStack>
        )
      })}
    </Flex>
  )
}
