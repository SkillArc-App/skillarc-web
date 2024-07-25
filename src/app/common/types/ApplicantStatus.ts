export type PassReason = {
  id: string
  description: string
}

export type ReasonResponse = {
  id: string
  response?: string
}

export type ApplicationStatus =
  'new' |
  'pending intro' |
  'intro made' |
  'interviewing' |
  'hire' |
  'pass'