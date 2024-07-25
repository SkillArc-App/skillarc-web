import { Attribute } from 'app/common/types/Attribute'
import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'

export const useAdminAttributes = () =>
  useAuthenticatedQuery(['attributes'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<Attribute[]>(`/admin/attributes`, token)

      return res.data
    }

    return getAll(token)
  })
