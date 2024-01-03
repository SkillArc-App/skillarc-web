import { post } from '@/frontend/http-common'

export default async function resetDBRails() {
  const response = await post('/create_test_user', {}, '')

  return response.data
}
