import { post } from '@/app/http-common'

export default async function createSeekerLead() {
  const response = await post('/test/create_seeker_lead', {}, '')

  return response.data
}
