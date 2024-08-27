import { Maybe } from '@/common/types/maybe'
import * as Sentry from '@sentry/nextjs'
import { UseQueryOptions } from '@tanstack/react-query'
import { get } from '../http-common'
import { FullUser } from '../services/user.service'
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
        const user = res.data
        Sentry.setUser({ email: user.email, id: user.id })

        return user
      }
      return getOne()
    },
    options,
  )

  return userQuery
}
