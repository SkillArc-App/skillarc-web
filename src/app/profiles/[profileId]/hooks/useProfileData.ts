import { Maybe } from '@/common/types/maybe'
import { useQuery } from '@tanstack/react-query'
import { useAuthToken } from '../../../../frontend/hooks/useAuthToken'
import { get } from '../../../../frontend/http-common'
import { GetOneProfileResponse } from '../../../../frontend/services/profile.service'
import { mixpanelInitProfile } from '../../../../frontend/utils/mixpanel'

export const useProfileData = (id: Maybe<string>) => {
  const token = useAuthToken()

  const profileQuery = useQuery(
    ['profile', id, token],
    async () => {
      if (!id) return

      const res = await get<GetOneProfileResponse>(`/profiles/${id}`, token)

      mixpanelInitProfile(res.data)

      return res.data
    },
    { enabled: !!id },
  )

  return profileQuery
}
