import { CoachTask } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachTasks = () =>
  useAuthenticatedQuery(['coachTasks'], ({ token }) => {
    const getCoachTasks = async () => {
      const res = await get<CoachTask[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/tasks/`, token)

      return res.data
    }

    return getCoachTasks()
  })
