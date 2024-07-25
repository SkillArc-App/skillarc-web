import { http } from '@/http-common'
import fileDownload from 'js-file-download'

export const downloadResume = (documentId: string, token: string) => {
  http
    .get(`/documents/resumes/${documentId}`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      // TODO figure out how to extract the provided
      // filename from the Content-Disposition
      // it comes back in the response headers but I
      // can't seem to extract it here
      fileDownload(response.data, 'resume.pdf')
    })
}
