'use client'

import { Flex } from '@chakra-ui/react'
import { Heading } from 'app/components/Heading'
import { LoadingPage } from 'app/components/Loading'
import { Text } from 'app/components/Text.component'
import { useAuthToken } from 'app/hooks/useAuthToken'
import { useUser } from 'app/hooks/useUser'
import { AllSetIcon } from 'app/icons/AllSet'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const HomeClient = () => {
  const router = useRouter()
  const token = useAuthToken()

  const { data: user, status, refetch: refetchUser } = useUser()

  useEffect(() => {
    if (status !== 'success') return
    if (!user) return
    if (!token) return

    if (user.recruiter) {
      router.push('/employers/jobs')
      return
    }

    if (!user.onboardingSession.completedAt) {
      router.push('/onboarding')
    } else if (user.profile.missingProfileItems.length > 0) {
      router.push(`/profiles/${user.profile.id}`)
    } else {
      router.push(`/jobs`)
    }
  }, [refetchUser, router, token, user, status])

  if (user?.trainingProviderProfile || user?.recruiter || !user?.onboardingSession?.completedAt) {
    return <LoadingPage />
  }

  return (
    <Flex color={'greyscale.100'} height={'100%'} width={'100%'}>
      <Flex
        p={'1rem'}
        top={'10rem'}
        position={'fixed'}
        alignItems={'center'}
        flexDir={'column'}
        width={'100%'}
        gap={'0.5rem'}
      >
        <AllSetIcon />
        <Heading mt={'0.25rem'} color={'greyscale.900'} variant={'h2'}>
          Your future is bright! 🎉
        </Heading>
        <Text textAlign={'center'} type={'b2'} color={'greyscale.600'} width={'50%'}>
          You and your new profile are going to do big things.
        </Text>
      </Flex>
    </Flex>
  )
}

export default withAuthenticationRequired(HomeClient)
