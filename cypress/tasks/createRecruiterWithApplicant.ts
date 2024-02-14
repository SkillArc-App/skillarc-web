import { post } from '@/frontend/http-common'

export default async function createRecruiterWithApplicant() {
  const response = await post('/test/create_recruiter_with_applicant', {}, '', { camel: false })

  return response.data
}
