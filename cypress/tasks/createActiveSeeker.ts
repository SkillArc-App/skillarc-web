import { post } from 'app/http-common'

export default async function createActiveSeeker() {
  const response = await post('/test/create_active_seeker', {}, '')

  return response.data
}
