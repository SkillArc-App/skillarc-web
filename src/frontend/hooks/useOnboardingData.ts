import { useQuery } from 'react-query'
import { http } from '../http-common'
import { OnboardingData } from '@/common/types/OnboardingData'
import axios from 'axios'

export const useOnboardingData = (token: string | null) => {
  const getOnboardingData = useQuery<OnboardingData>(['onboarding_data', token], () =>
    getData(token),
  )

  return { getOnboardingData }
}

const getData = async (token: string | null): Promise<OnboardingData> => {
  if (!token) {
    return Promise.reject('No user id')
  }
  return (
    await axios.create({ withCredentials: false }).post(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  ).data
}
