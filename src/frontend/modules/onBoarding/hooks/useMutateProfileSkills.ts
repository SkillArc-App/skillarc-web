import { useUser } from '@/frontend/hooks/useUser'
import { FrontendProfileSkillsService } from '@/frontend/services/profileSkills.service'
import { useAuth0 } from '@auth0/auth0-react'
import { ProfileSkill } from '@prisma/client'
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

    return FrontendProfileSkillsService.create(skill, user?.profile?.id, token)
  })
}
