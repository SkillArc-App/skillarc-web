import { useUser } from '@/frontend/hooks/useUser'
import { FrontendUserService } from '@/frontend/services/user.service'
import { User } from '@/common/types/User'
import { useMutation } from 'react-query'

export const useUpdateOnboardingUser = () => {
  const { data: currentUser } = useUser()
  return useMutation((user: Partial<User>) => {
    user.id = currentUser?.id
    return FrontendUserService.update(user)
  })
}
