import { post } from '@/frontend/http-common'

export default async function createUser() {
  const response = await post('/test/create_user', {}, '')

  return response.data
}
