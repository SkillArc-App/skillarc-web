import { post } from '@/frontend/http-common'

export default async function createSeeker() {
  const response = await post('/test/create_seeker', {}, '', { camel: true })

  return response.data
}
