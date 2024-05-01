import { get } from '../http-common'

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
  const res = await get<ProgramStudents>(`/students`, token)

  return res.data
}

export const FrontendStudentService = {
  getFor,
}
