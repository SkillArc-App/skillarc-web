import { get, post } from '@/frontend/http-common'

export default async function clearFailedJobs() {
  const response = await post('/test/clear_failed_jobs', {}, '')

  return true
}
