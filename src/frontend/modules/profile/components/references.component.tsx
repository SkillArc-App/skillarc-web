import { Avatar, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { Text } from '../../../components/Text.component'
export const ProfileReferences = () => {
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
      <HStack align="top" gap={2} pt={1}>
        <Avatar />
        <VStack align="left" gap={2}>
          <Flex direction="column" gap={2}>
            <Heading variant="h4" color={'greyscale.900'}>
              Reena Lawry, Manager at Raising Cane’s
            </Heading>
            <Text type="b2" color="greyscale.600">
              Justin always showed up on time and showed a high aptitude for learning.
            </Text>
          </Flex>
        </VStack>
      </HStack>
      <HStack align="top" gap={2} pt={1}>
        <Avatar />
        <VStack align="left" gap={2}>
          <Flex direction="column" gap={2}>
            <Heading variant="h4" color={'greyscale.900'}>
              Alonzo Pitt, Science teacher at Thomas Worthington High School
            </Heading>
            <Text type="b2" color="greyscale.600">
              Justin is one of the most engaged students in my Science classes!
            </Text>
          </Flex>
        </VStack>
      </HStack>
    </Flex>
  )
}
