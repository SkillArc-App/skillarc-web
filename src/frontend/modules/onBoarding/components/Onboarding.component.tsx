import { Button, chakra, Flex } from '@chakra-ui/react'

export const Onboarding = () => {
  return <Flex w="100%" h="100%"></Flex>
}

const QuestionContainer = chakra(Flex, {
  baseStyle: {
    flexDir: 'column',
    flexGrow: 3,
    justifyContent: 'center',
  },
})
