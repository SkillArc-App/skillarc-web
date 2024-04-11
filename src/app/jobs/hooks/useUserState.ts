import { useAuth0 } from 'lib/auth-wrapper'
import { useUser } from '../../../frontend/hooks/useUser'

export const enum UserState {
  UnAuthenticated,
  IncompleteOnboarding,
  Ready,
}

const useUserState = () => {
  const { isAuthenticated } = useAuth0()
  const { data: user } = useUser()

  if (!isAuthenticated) {
    return UserState.UnAuthenticated
  }

  if (!user?.onboardingSession?.completedAt) {
    return UserState.IncompleteOnboarding
  }

  return UserState.Ready
}

export default useUserState
