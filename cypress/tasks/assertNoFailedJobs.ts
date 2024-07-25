import { get } from '@/http-common'

function poll(predicate: () => Promise<boolean>, interval: number, timeout?: number) {
  return new Promise<void>((resolve, reject) => {
    // Start the interval
    const intervalId = setInterval(async () => {
      try {
        // Check the predicate
        if (await predicate()) {
          clearInterval(intervalId)
          resolve()
        }
      } catch (error) {
        clearInterval(intervalId)
        reject(error)
      }
    }, interval)

    // Optionally set a timeout to stop polling after a certain time
    if (timeout) {
      setTimeout(() => {
        clearInterval(intervalId)
        reject(new Error('Polling timed out.'))
      }, timeout)
    }
  })
}

export default async function assertNoFailedJobs() {
  await poll(async () => {
    const response = await get('/test/jobs_settled')
    return response.data.settled
  }, 1000)

  const response = await get('/test/assert_no_failed_jobs', '')

  if (response.status !== 204) {
    throw new Error(`${response.data.exception}: ${response.data.message}`, response.data.backtrace)
  }

  return true
}
