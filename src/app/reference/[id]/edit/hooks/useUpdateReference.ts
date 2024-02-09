import { FrontendReferenceService } from '@/frontend/services/reference.service'

export type Reference = {
  id: string
  author_profile_id: string
  reference_text: string
  seeker_profile_id: string
  training_provider_id: string
  created_at: Date
  updated_at: Date
}

export const useUpdateReference = () => {
  const onUpdateReference = (reference: Partial<Reference>, token: string) => {
    return FrontendReferenceService.update(reference, token)
  }
  return { onUpdateReference }
}
