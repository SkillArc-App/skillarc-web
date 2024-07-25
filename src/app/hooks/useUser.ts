import { Maybe } from '@/app/common/types/maybe'
import { UseQueryOptions } from '@tanstack/react-query'
import { get } from '../../frontend/http-common'
import { FullUser } from '../../frontend/services/user.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUser = (
  options: Omit<
    UseQueryOptions<FullUser, unknown, FullUser, readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  const userQuery = useAuthenticatedQuery(
    ['me'],
    ({ token }) => {
      const getOne = async () => {
        const res = await get<FullUser>(`/one_user/`, token)
        return res.data
      }
      return getOne()
    },
    options,
  )

  return userQuery
}
