import { Maybe } from '@/app/common/types/maybe'
import { useQuery } from '@tanstack/react-query'
import { useAuthToken } from '../../../hooks/useAuthToken'
import { get } from '../../../http-common'
import { GetOneProfileResponse } from '../../../services/profile.service'

export const useProfileData = (id: Maybe<string>) => {
  const token = useAuthToken()

  const profileQuery = useQuery(
    ['profile', id, token],
    async () => {
      if (!id) return

      const res = await get<GetOneProfileResponse>(`/profiles/${id}`, token)

      return res.data
    },
    { enabled: !!id },
  )

  return profileQuery
}
