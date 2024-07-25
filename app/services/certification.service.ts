import { get } from '../http-common'

export type MasterCertification = {
  id: string
  certification: string
}

const getAll = async (token: string) => {
  const res = await get<MasterCertification[]>(`/master_certifications`, token)

  return res.data
}

export const FrontendMasterCertificationService = {
  getAll,
}
