import { Maybe } from '@/common/types/maybe'
import { UseQueryOptions } from '@tanstack/react-query'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useIndustries = (
  options: Omit<
    UseQueryOptions<string[], unknown, string[], readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  const userQuery = useAuthenticatedQuery(
    ['me'],
    ({ token }) => {
      const getOne = async () => {
        const res = await get<string[]>(`/industries`, token)
        const user = res.data

        return user
      }
      return getOne()
    },
    options,
  )

  return userQuery
}
