import { post } from '@/frontend/http-common'

export default async function createJob() {
  const response = await post('/test/create_job', {}, '')

  return response.data
}
