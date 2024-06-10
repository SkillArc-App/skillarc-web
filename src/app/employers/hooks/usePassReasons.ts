import { PassReason } from '@/common/types/ApplicantStatus'
import { get } from '../../../frontend/http-common'
import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'

export const usePassReasons = () => {
  return useAuthenticatedQuery(['pass_reasons'], async ({ token }) => {
    const res = await get<PassReason[]>(`/pass_reasons`, token)

    return res.data
  })
}
