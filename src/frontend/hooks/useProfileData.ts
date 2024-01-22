import axios from 'axios'
import { useQuery } from 'react-query'
import { GetOneProfileResponse } from '../services/profile.service'
import { mixpanelInitProfile } from '../utils/mixpanel'

export const useProfileData = (id: string) => {
  const profileQuery = useQuery(['profile', id], () => {
    if (!id) return

    return getOne(id)
  })

  return { profileQuery }
}

const getOne = async (id: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneProfileResponse>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`, {})

  mixpanelInitProfile(res.data)

  return res.data
}
