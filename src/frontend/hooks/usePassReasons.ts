import { PassReason } from '@/common/types/ApplicantStatus'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const usePassReasons = () => {
  return useAuthenticatedQuery(['pass_reasons'], async ({ token }) => {
    const res = await get<PassReason[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/pass_reasons`,
      token,
    )

    return res.data
  })
}
