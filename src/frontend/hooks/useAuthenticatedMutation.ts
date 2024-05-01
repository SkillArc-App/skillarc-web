import { MutationFunction, QueryFunctionContext, QueryKey, UseMutationOptions, useMutation } from 'react-query'
import { useAuthToken } from './useAuthToken'

export type AuthenticatedMutationFunction<TData = unknown, TVariables = unknown> = (
  variables: TVariables,
  token: string,
) => Promise<TData>

export interface QueryAuthenticatedFunctionContext<
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = any,
> extends QueryFunctionContext<TQueryKey, TPageParam> {
  token: string
}

export const useAuthenticatedMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: AuthenticatedMutationFunction<TData, TVariables>,
  options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> = {},
) => {
  const token = useAuthToken()

  const authenticatedMutationFunction: MutationFunction<TData, TVariables> = (variables) => {
    if (!token) {
      return Promise.reject('Authentication token not set')
    }

    return mutationFn(variables, token)
  }

  return useMutation(authenticatedMutationFunction, options)
}
