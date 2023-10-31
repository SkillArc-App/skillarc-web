import { Preference } from '@/common/types/Profile'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileService } from '@/frontend/services/profile.service'
import { FrontendProfileSkillsService } from '@/frontend/services/profileSkills.service'
import { ProfileSkill } from '@prisma/client'
import { useMutation } from 'react-query'

export const useCreatePreferences = () => {
  const { data: user } = useUser()

  return useMutation((preferences: Partial<Preference>) => {
    return FrontendProfileService.addPreferences(preferences, user?.profile?.id)
  })
}
