import { useQuery } from 'react-query'
import { FrontendMasterSkillsService } from '../../../frontend/services/skills.service'

export const useMasterSkillData = () => {
  const masterSkillQuery = useQuery(['masterSkill'], () => {
    return FrontendMasterSkillsService.getAll()
  })

  return { masterSkillQuery }
}
