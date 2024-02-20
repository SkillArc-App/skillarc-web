import axios from 'axios'

export type MasterCertification = {
  id: string
  certification: string
  created_at: Date
  updated_at: Date
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
  getAll,
}
