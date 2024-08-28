import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Questions } from '../types'
import { UseQueryOptions } from '@tanstack/react-query'
import { Maybe } from '@/common/types/maybe'

export const useAllQuestionsQuery = (
  options: Omit<
    UseQueryOptions<Questions[], unknown, Questions[], readonly Maybe<string>[]>,
    'queryKey' | 'queryFn'
  > = {},
) =>
  useAuthenticatedQuery(
    ['questions'],
    ({ token }) => {
      const getQuestions = async () => {
        const res = await get<Questions[]>(`screeners/questions/`, token)

        return res.data
      }

      return getQuestions()
    },
    options,
  )
