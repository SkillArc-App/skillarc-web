export type Resume = {
  id: string
  anonymized: boolean
  documentStatus: DocumentStatus
  generatedAt?: string
  documentKind: DocumentKind
  personId: string
}

export type ResumeRequest = {
  personId: string
  anonymized: boolean
  documentKind: DocumentKind
  checks: Checks[]
}

export enum DocumentKind {
  PDF = 'pdf',
}

export enum Checks {
  BACKGROUND = 'background',
  DRUG = 'drug',
}

export enum DocumentStatus {
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}
