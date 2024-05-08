import { post } from '../http-common'

const apply = (jobId: string, token: string) => post(`/jobs/${jobId}/apply`, {}, token)

export const FrontendJobInteractionsService = {
  apply,
}
