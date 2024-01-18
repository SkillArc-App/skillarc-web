import { Maybe } from '@/common/types/maybe'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { QueryFunctionContext, QueryKey, UseQueryOptions, useQuery } from 'react-query'

export type QueryAuthenticatedFunction<T = unknown, TQueryKey extends QueryKey = QueryKey> = (
  context: QueryAuthenticatedFunctionContext<TQueryKey>,
) => T | Promise<T>

export interface QueryAuthenticatedFunctionContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = any,
> extends QueryFunctionContext<TQueryKey, TPageParam> {
  token: string
}

export const useAuthenticatedQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
>(
  queryKey: Maybe<string>[],
  queryFn: QueryAuthenticatedFunction<TQueryFnData, readonly Maybe<string>[]>,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<Maybe<string>>(undefined)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const combinedOptions: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {
    ...options,
    enabled: (options.enabled ?? true) && !!token,
  }

  return useQuery(
    [...queryKey, token],
    (context) => queryFn({ ...context, token: token as string }),
    combinedOptions,
  )
}
