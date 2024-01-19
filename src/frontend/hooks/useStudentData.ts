import { FrontendStudentService } from '../services/student.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useStudentData = () => {
  const getStudents = useAuthenticatedQuery(['student'], ({ token }) => {
    return FrontendStudentService.getFor(token)
  })

  return { getStudents }
}
