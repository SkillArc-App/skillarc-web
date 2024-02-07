import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { userCanSeeJobs } from '@/frontend/helpers/seeJobRequirements'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useUser } from '@/frontend/hooks/useUser'
import { http } from '@/frontend/http-common'
import { AllSetIcon } from '@/frontend/icons/AllSet.icon'
import { Flex } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()
  const { isLoading } = useAuth0()
  const token = useAuthToken()

  const { data: user, refetch: refetchUser } = useUser()

  useEffect(() => {
    if (user && userCanSeeJobs(user))
    if (user?.trainingProviderProfile) {
      router.push('/students')
      return
    }
    if (user?.recruiter) {
      router.push('/employers/jobs')
      return
    }

    if (token) {
      const trainingProviderInviteCode = localStorage.getItem('trainingProviderInviteCode')
      const seekerInviteCode = localStorage.getItem('seekerInviteCode')
      const employerInviteCode = localStorage.getItem('employerInviteCode')
      const preOnboardingJobInterest = localStorage.getItem('preOnboardingJobInterest')

      if (trainingProviderInviteCode) {
        localStorage.removeItem('trainingProviderInviteCode')
        http.post('/api/invites', { trainingProviderInviteCode }).then((_) => {
          refetchUser()
        })
      } else if (seekerInviteCode) {
        localStorage.removeItem('seekerInviteCode')
        http.post('/api/invites', { seekerInviteCode })
      } else if (employerInviteCode) {
        localStorage.removeItem('employerInviteCode')
        axios
          .create({ withCredentials: false })
          .put(
            `${process.env.NEXT_PUBLIC_API_URL}/employer_invites/${employerInviteCode}/used`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((res) => {
            refetchUser()
          })
      } else if (preOnboardingJobInterest) {
        localStorage.removeItem('preOnboardingJobInterest')
        router.push(`/jobs/${preOnboardingJobInterest}`)
        return
      }

      if (!user) return
      if (!user.onboardingSession?.completed_at) {
        router.push('/onboarding')
      } else if (user.profile.missingProfileItems.length > 0) {
        router.push(`/profiles/${user.profile.id}`)
      } else {
        router.push(`/jobs`)
      }
    }
  }, [refetchUser, router, token, user])

  if (isLoading) return <LoadingPage />
  if ((user?.trainingProviderProfile || user?.recruiter?.length) ?? 0 > 0) return <></>
  if (!token) return <LoadingPage />

  if (user?.onboardingSession?.completed_at)
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

  return <></>
}

export default withAuthenticationRequired(Home)
