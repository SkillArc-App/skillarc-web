import { FrontendProgramService } from '@/frontend/services/program.service'
import { useQuery } from 'react-query'

export const useProgramData = (id: string) => {
  const getProgram = useQuery(['program', id], () => FrontendProgramService.getOne(id))

  return { getProgram }
}
