'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useUser } from '@/frontend/hooks/useUser'
import { AllSetIcon } from '@/frontend/icons/AllSet.icon'
import { Flex } from '@chakra-ui/react'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()
  const { isLoading } = useAuth0()
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

  if (user?.trainingProviderProfile || user?.recruiter || !user?.onboardingSession?.completedAt)
    return <LoadingPage />

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

export default withAuthenticationRequired(Home)
