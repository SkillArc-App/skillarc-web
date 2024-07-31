import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Questions } from '../types'

export const useQuestionsQuery = (id: string) =>
  useAuthenticatedQuery(['questions'], ({ token }) => {
    const getQuestions = async () => {
      const res = await get<Questions>(`screeners/questions/${id}`, token)

      return res.data
    }

    return getQuestions()
  })
