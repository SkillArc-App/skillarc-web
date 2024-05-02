import { FrontendReferenceService } from '@/frontend/services/reference.service'

export type Reference = {
  id: string
  authorProfileId: string
  referenceText: string
  seekerProfileId: string
  trainingProviderId: string
}

export const useUpdateReference = () => {
  const onUpdateReference = (reference: Partial<Reference>, token: string) => {
    return FrontendReferenceService.update(reference, token)
  }
  return { onUpdateReference }
}
