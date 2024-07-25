import { post } from '@/app/http-common'

export default async function createCoach() {
  const response = await post('/test/create_coach', {}, '')

  return response.data
}
