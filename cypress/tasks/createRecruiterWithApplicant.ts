import { post } from '@/app/http-common'

export default async function createRecruiterWithApplicant() {
  const response = await post('/test/create_recruiter_with_applicant', {}, '')

  return response.data
}
