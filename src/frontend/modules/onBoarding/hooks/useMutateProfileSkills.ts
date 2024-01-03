import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileSkillsService } from '@/frontend/services/profileSkills.service'
import { ProfileSkill } from '@prisma/client'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

export const useMutateProfileSkills = () => {
  const { data: user } = useUser()

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  return useMutation((skill: Partial<ProfileSkill>) => {
    if (!token) return Promise.reject('No token')

    const profileId = user?.profile?.id

    if (!profileId) return Promise.reject('No profile id')

    return FrontendProfileSkillsService.create(skill, profileId, token)
  })
}
