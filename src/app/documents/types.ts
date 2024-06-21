export type Resume = {
  id: string
  anonymized: boolean,
  documentStatus: string,
  generatedAt: string
  documentKind: DocumentKind
  personId: string
}

export type ResumeRequest = {
  personId: string
  anonymized: boolean,
  documentKind: DocumentKind
  pageLimit: number
}

export enum DocumentKind {
  PDF = 'pdf'
}

export enum DocumentStatus {
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}