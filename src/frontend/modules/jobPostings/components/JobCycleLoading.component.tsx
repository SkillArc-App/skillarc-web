import { Flex } from '@chakra-ui/react'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FittingPiece } from '@/frontend/icons/FittingPiece.icon'

export const JobCycleLoading = ({ loadingText }: { loadingText: string }) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case '.':
            return '. .'
          case '. .':
            return '. . .'
          case '. . .':
            return '.'
          default:
            return '.'
        }
      })
    }, 500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Flex w="100%" h="100%" flexWrap="wrap" gap="1rem">
      <FittingPiece w="100%" marginTop="30%" />
      <Heading type="h2" color="#212529" w="100%" textAlign="center">
        Searching for your match
      </Heading>
      <Flex w="100%" justifyContent="center">
        <Text type="b1" color="#6C757D" textAlign="right" w="max-content">
          {loadingText}
        </Text>
        <Text type="b1" color="#6C757D" textAlign="left" w="2rem">
          {dots}
        </Text>
      </Flex>
    </Flex>
  )
}
