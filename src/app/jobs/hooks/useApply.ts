import { OneMatchedJobPosting } from '@/app/components/JobCard'
import { SearchJob } from '@/common/types/Search'
import { Maybe } from '@/common/types/maybe'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import useUserState, { UserState } from './useUserState'

export const applyCopyOptions = {
  [UserState.UnAuthenticated]: 'Apply by Login',
  [UserState.IncompleteOnboarding]: 'Apply by Completing Your SkillArc Profile',
  [UserState.Ready]: 'Apply With Your SkillArc Profile',
}

type UseApplyProps<T> = {
  job: Maybe<T>
  onReadyToApply: (job: T, token: string) => void
}

function useApply<T extends SearchJob | OneMatchedJobPosting | GetOneJobPosting>({
  job,
  onReadyToApply,
}: UseApplyProps<T>) {
  const userState = useUserState()
  const { loginWithRedirect } = useAuth0()
  const router = useRouter()
  const token = useAuthToken()

  const onApply = () => {
    if (!job) {
      return
    }

    if (userState == UserState.UnAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.href,
        },
      })
    }

    if (!token) {
      return
    }

    if (userState == UserState.IncompleteOnboarding) {
      localStorage.setItem('preOnboardingJobInterest', job.id)
      router.push('/onboarding')
    } else {
      onReadyToApply(job, token)
    }
  }

  const applyCopy = applyCopyOptions[userState]

  return {
    onApply,
    applyCopy,
  }
}

export default useApply
