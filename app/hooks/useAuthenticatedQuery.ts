import { QueryFunctionContext, QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Maybe } from 'app/common/types/maybe'
import { useAuthToken } from './useAuthToken'

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
  const token = useAuthToken()

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
