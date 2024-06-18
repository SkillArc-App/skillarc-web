import { MasterCertification } from '../../frontend/services/certification.service'
import { Employer } from '../../frontend/services/employer.service'
import { MasterSkill } from '../../frontend/services/skills.service'

export type CareerPath = {
  id: string
  title: string
  upperLimit: string
  lowerLimit: string
  order: number
}

export type JobPhoto = {
  id: string
  photoUrl: string
  jobId: string
}

export type Testimonial = {
  id: string
  name: string
  title: string
  testimonial: string
  photoUrl: string | null
}

export type AdminJobAttribute = {
  id: string
  attributeId: string
  attributeName: string
  acceptibleSet: string[]
}

export type AdminJob = {
  id: string
  benefitsDescription: string
  responsibilitiesDescription: string | null
  employmentTitle: string
  location: string
  employmentType: 'FULLTIME' | 'PARTTIME'
  hideJob: boolean
  schedule: string | null
  workDays: string | null
  requirementsDescription: string | null
  industry: string[]
  createdAt: string
  category: 'marketplace' | 'staffing'
  employer: Employer
  jobAttributes: AdminJobAttribute[]
  learnedSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  jobTag: {
    id: string
    tag: {
      id: string
      name: string
    }
  }[]
  numberOfApplicants: number
  testimonials: Testimonial[]
}

export type Job = {
  id: string
  benefitsDescription: string
  responsibilitiesDescription: string | null
  employmentTitle: string
  location: string
  employmentType: 'FULLTIME' | 'PARTTIME'
  schedule: string | null
  workDays: string | null
  requirementsDescription: string | null
  category: 'marketplace' | 'staffing'
  employer: Employer
  applicationStatus?: string
  elevatorPitch?: string
  learnedSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  jobTag: {
    id: string
    tag: {
      id: string
      name: string
    }
  }[]
  testimonials: Testimonial[]
}
