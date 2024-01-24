export interface SeekerNote {
  note: string
  noteTakenBy: string
  date: string
  noteId: string
}

export interface SeekerApplication {
  status: string
  employerName: string
  jobId: string
  employmentTitle: string
}

export interface CoachSeeker {
  seekerId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  barriers: string[]
  assignedCoach: string
  lastContacted: string
  lastActiveOn: string
  skillLevel: string
  stage: string
  notes: SeekerNote[]
  applications: SeekerApplication[]
}

export type Coach = {
  id: string
  email: string
}
