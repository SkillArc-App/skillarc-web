import { useQuery } from 'react-query'
import { FrontendProgramService } from '../services/program.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllProgramData = () => {
  const getAllPrograms = useAuthenticatedQuery(['programs'], ({ token }) => {
    return FrontendProgramService.getAll(token)
  })

  return { getAllPrograms }
}

export const useProgramDataForTrainingProvider = () => {
  const getPrograms = useAuthenticatedQuery(['tpPrograms'], ({ token }) => {
    return FrontendProgramService.getAllForTrainingProvder(token)
  })

  return { getPrograms }
}

export const useProgramData = (id: string) => {
  const getProgram = useQuery(['program', id], () => FrontendProgramService.getOne(id))

  return { getProgram }
}
