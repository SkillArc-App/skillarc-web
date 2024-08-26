'use client'

import { Link, VStack } from '@chakra-ui/react'
import { useOnboardingBypassMutation } from '../hooks/useOnboardingBypassMutation'

export default function BypassLink() {
  const onboarding = useOnboardingBypassMutation()

  return (
    <VStack>
      <Link onClick={() => onboarding.mutate()}>Finish your profile later</Link>
    </VStack>
  )
}
