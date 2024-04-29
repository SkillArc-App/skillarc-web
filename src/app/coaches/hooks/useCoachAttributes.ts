import { Attribute } from '@/common/types/Attribute'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachAttributes = () =>
  useAuthenticatedQuery(['attributes'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<Attribute[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/attributes`,
        token,
      )

      return res.data
    }

    return getAll(token)
  })
