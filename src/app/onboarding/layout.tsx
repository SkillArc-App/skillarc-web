'use client'

import { useOnboardingQuery } from '@/app/onboarding/hooks/useOnboardingQuery'
import { Flex, Progress } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Onboarding = ({ children }: { children: React.ReactNode }) => {
  const { data } = useOnboardingQuery()

  return (
    <>
      <Flex bg={'greyscale.100'} w="100%">
        <Flex flexDir={'column'} px={'1rem'} py={'1.5rem'} gap={'0.5rem'} width={'100%'}>
          <Progress
            mb={'2rem'}
            borderRadius={'2px'}
            colorScheme="green"
            size="sm"
            value={data?.progress || 0}
          />
          {children}
        </Flex>
      </Flex>
    </>
  )
}

export default withAuthenticationRequired(Onboarding)
