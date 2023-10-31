import axios from 'axios'

type ProgramStudents = {
  programName: string
  programId: string
  students: {
    firstName: string
    lastName: string
    email: string
    profileId: string
    reference: {
      referenceText: string
      referenceId: string
    }
    status: string
    hiringStatus: string
  }[]
}[]

const getFor = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<ProgramStudents>(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendStudentService = {
  getFor,
}
