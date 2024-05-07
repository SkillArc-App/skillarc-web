import { Attribute } from '@/common/types/Attribute'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useAdminAttributes = () =>
  useAuthenticatedQuery(['attributes'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<Attribute[]>(`/admin/attributes`, token)

      return res.data
    }

    return getAll(token)
  })
