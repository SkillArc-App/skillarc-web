import { Employer } from './Employer'

export type Job = {
  id: string
  employerId?: string
  employer?: Employer
  benefitsDescription?: string
  responsibilitiesDescription?: string
  employmentTitle?: string
  location?: string
  employmentType?: string
  workDays?: string
  schedule?: string
  learnedSkills?: LearnedSkill[]
  desiredSkills?: DesiredSkill[]
  desiredCertifications?: DesiredCertification[]
  careerPaths?: CareerPath[]
}

export type LearnedSkill = {
  id: string
  jobId: string
  masterSkillId: string
}

export type DesiredSkill = {
  id: string
  jobId: string
  masterSkillId: string
}

export type DesiredCertification = {
  id: string
  jobId: string
  masterCertificationId: string
}

export type CareerPath = {
  id: string
  title: string
  upperLimit: string
  lowerLimit: string
  order?: number
  jobId: string
}

export type MasterSkill = {
  id: string
  skill: string
  type: 'PERSONAL' | 'TECHNICAL'
}
