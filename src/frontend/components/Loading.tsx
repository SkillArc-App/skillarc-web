import { CircularProgress, Flex, Heading, VStack } from '@chakra-ui/react'

export const LoadingPage = () => {
  return (
    <Flex w="100%" h="100%" flexWrap="wrap" gap="1rem" mt="5rem">
      <Flex w="100%" justifyContent="center">
        <CircularProgress isIndeterminate color="blue.300" size="48px" />
        <Heading as="h2" size="md">
          Loading...
        </Heading>
      </Flex>
    </Flex>
  )
}
