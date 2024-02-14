import { post } from '@/frontend/http-common'

export default async function createActiveSeeker() {
  const response = await post('/test/create_active_seeker', {}, '', { camel: false})

  return response.data
}
