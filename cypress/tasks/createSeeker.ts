import { post } from '@/http-common'

export default async function createSeeker() {
  const response = await post('/test/create_seeker', {}, '')

  return response.data
}
