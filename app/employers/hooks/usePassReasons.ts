import { PassReason } from '@/common/types/ApplicantStatus'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { get } from '../../http-common'

export const usePassReasons = () => {
  return useAuthenticatedQuery(['pass_reasons'], async ({ token }) => {
    const res = await get<PassReason[]>(`/pass_reasons`, token)

    return res.data
  })
}
