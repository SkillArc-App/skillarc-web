import { CoachTask } from 'app/coaches/types'
import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'

export const useCoachTasks = () =>
  useAuthenticatedQuery(['coachTasks'], ({ token }) => {
    const getCoachTasks = async () => {
      const res = await get<CoachTask[]>(`/coaches/tasks/`, token)

      return res.data
    }

    return getCoachTasks()
  })

export const useCoachSeekerTasks = (id?: string) =>
  useAuthenticatedQuery(
    ['coachTasks', id],
    ({ token }) => {
      const getCoachTasks = async () => {
        const res = await get<CoachTask[]>(`/coaches/tasks`, token, { contextId: id })

        return res.data
      }

      return getCoachTasks()
    },
    { enabled: !!id },
  )
