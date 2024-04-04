import { get } from '@/frontend/http-common'

export default async function assertNoFailedJobs() {
  const response = await get('/test/assert_no_failed_jobs', '')

  if (response.status !== 204) {
    throw new Error(`${response.data.exception}: ${response.data.message}`, response.data.backtrace)
  }

  return true
}
