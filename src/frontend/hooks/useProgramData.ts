import { useQuery } from 'react-query'
import { FrontendProgramService } from '../services/program.service'

export const useProgramData = (id: string) => {
  const getProgram = useQuery(['program', id], () => FrontendProgramService.getOne(id))

  return { getProgram }
}
