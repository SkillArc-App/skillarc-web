import { FrontendReferenceService } from '@/frontend/services/reference.service'

export const useAddReference = () => {
  const onAddReference = async (seekerProfileId: string, reference: string, token: string) => {
    await FrontendReferenceService.addReference(seekerProfileId, reference, token)
  }

  return { onAddReference }
}
