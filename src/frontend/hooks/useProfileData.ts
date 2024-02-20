import { Maybe } from '@/common/types/maybe'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { GetOneProfileResponse } from '../services/profile.service'
import { mixpanelInitProfile } from '../utils/mixpanel'
import { useAuthToken } from './useAuthToken'

export const useProfileData = (id: Maybe<string>) => {
  const token = useAuthToken()

  const profileQuery = useQuery(
    ['profile', id, token],
    async () => {
      if (!id) return

      const res = await get<GetOneProfileResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`,
        token,
      )

      mixpanelInitProfile(res.data)

      return res.data
    },
    { enabled: !!id },
  )

  return profileQuery
}
