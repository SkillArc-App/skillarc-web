import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { GetOneProfileResponse } from '../services/profile.service'
import { mixpanelInitProfile } from '../utils/mixpanel'
import { useUser } from './useUser'

export const useProfileData = (id: string) => {
  const { data: user } = useUser()

  const profileQuery = useQuery(['profile', id], () => {
    if (!id) return

    return getOne(id)
  })

  const isMyProfile = useMemo(() => user?.profile?.id === id, [user, id])

  return { profileQuery, isMyProfile }
}

const getOne = async (id: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneProfileResponse>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}`, {})

  mixpanelInitProfile(res.data)

  return res.data
}
