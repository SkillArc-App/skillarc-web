import axios from 'axios'
import { http } from '../http-common'

export type MasterCertification = {
  id: string
  certification: string
  created_at: Date
  updated_at: Date
}

const getOne = async (masterCertificationId: string) => {
  const res = await http.get<MasterCertification>(
    `/api/masterCertifications/${masterCertificationId}`,
  )
  return res.data
}

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<MasterCertification[]>(`${process.env.NEXT_PUBLIC_API_URL}/master_certifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendMasterCertificationService = {
  getOne,
  getAll,
}
