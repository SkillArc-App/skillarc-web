import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { Questions } from '../types'

export const useQuestionsQuery = () =>
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
