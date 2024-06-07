import { UseQueryOptions } from 'react-query'
import { get } from '../http-common'
import { FullUser } from '../services/user.service'
import { mixpanelInitUser } from '../utils/mixpanel'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'
import { Maybe } from '@/common/types/maybe'

export const useUser = (
  options: Omit<
    UseQueryOptions<FullUser, unknown, FullUser, readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  const userQuery = useAuthenticatedQuery(['me'], ({ token }) => {
    const getOne = async () => {
      const res = await get<FullUser>(`/one_user/`, token)
      mixpanelInitUser(res.data)
      return res.data
    }
    return getOne()
  }, options)

  return userQuery
}
