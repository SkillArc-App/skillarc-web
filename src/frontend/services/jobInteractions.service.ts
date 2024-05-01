import { post } from '../http-common'

const apply = async (jobId: string, token: string) => {
  await post(`/jobs/${jobId}/apply`, {}, token)
}

export const FrontendJobInteractionsService = {
  apply,
}
