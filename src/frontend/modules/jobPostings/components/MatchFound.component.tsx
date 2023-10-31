import { Button, Flex } from '@chakra-ui/react'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { Business } from '@/frontend/icons/Business.icon'
import { Dispatch, SetStateAction } from 'react'
import ConfettiAnimation from './Confetti.component'

export const MatchFound = ({
  setJobCycleState,
}: {
  setJobCycleState: Dispatch<SetStateAction<'contentIsLoading' | 'matchFoundPrompt' | 'jobPosting'>>
}) => {
  setTimeout(() => {
    setJobCycleState('jobPosting')
  }, 4000)

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <ConfettiAnimation width={window.innerWidth} height={window.innerHeight} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Flex w="100%" h="100%" flexWrap="wrap" gap="1rem" justifyContent="center" p="1rem">
          <Business w="100%" marginTop="25%" />
          <Heading type="h2" color="#212529" w="100%" textAlign="center">
            Match found 🎉
          </Heading>
          <Text type="b1" color="#6C757D" textAlign="center">
            We found a job that matches your skills!
          </Text>
        </Flex>
      </div>
    </div>
  )
}
