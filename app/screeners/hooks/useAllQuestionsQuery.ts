import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Questions } from '../types'

export const useAllQuestionsQuery = () =>
  useAuthenticatedQuery(
    ['questions'],
    ({ token }) => {
      const getQuestions = async () => {
        const res = await get<Questions[]>(`screeners/questions/`, token)

        return res.data
      }

      return getQuestions()
    },
    { refetchInterval: 2000 },
  )
