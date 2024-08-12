'use client'

import { useOnboardingQuery } from '@/onboarding/hooks/useOnboardingQuery'
import { Progress } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Onboarding = ({ children }: { children: React.ReactNode }) => {
  const { data } = useOnboardingQuery()

  return (
    <>
      <Progress
        mb={'2rem'}
        borderRadius={'2px'}
        colorScheme="green"
        size="sm"
        value={data?.progress || 0}
      />
      {children}
    </>
  )
}

export default withAuthenticationRequired(Onboarding)
