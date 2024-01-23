import { useQuery } from 'react-query'
import { get } from '../http-common'
import { GetOneProfileResponse } from '../services/profile.service'
import { mixpanelInitProfile } from '../utils/mixpanel'
import { useAuthToken } from './useAuthToken'

export const useProfileData = (id: string) => {
  const token = useAuthToken()

  const profileQuery = useQuery(
    ['profile', id, token],
    () => {
      if (!id) return

      return getOne(id, token)
    },
    { enabled: !!id },
  )

  return { profileQuery }
}

const getOne = async (id: string, token?: string) => {
  const res = await get<GetOneProfileResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`,
    token,
    { camel: true },
  )

  mixpanelInitProfile(res.data)

  return res.data
}
