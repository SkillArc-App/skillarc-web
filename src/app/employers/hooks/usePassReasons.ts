import { PassReason } from '@/app/common/types/ApplicantStatus'
import { get } from '../../../frontend/http-common'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const usePassReasons = () => {
  return useAuthenticatedQuery(['pass_reasons'], async ({ token }) => {
    const res = await get<PassReason[]>(`/pass_reasons`, token)

    return res.data
  })
}
