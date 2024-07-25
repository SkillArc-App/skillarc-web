import { post } from 'app/http-common'

export default async function clearFailedJobs() {
  const response = await post('/test/clear_failed_jobs', {}, '')

  return true
}
