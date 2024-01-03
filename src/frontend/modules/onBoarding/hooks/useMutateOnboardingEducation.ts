import { EducationExperience } from '@/common/types/EducationExperience'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendEducationExperiencesService } from '@/frontend/services/educationexperiences.service'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

export const useMutateOnboardingEducation = () => {
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

  return useMutation((educationExperience: Partial<EducationExperience>) => {
    if (!token) return Promise.reject('No token')

    const profileId = user?.profile?.id

    if (!profileId) return Promise.reject('No profile id')

    return FrontendEducationExperiencesService.create(educationExperience, profileId, token)
  })
}
