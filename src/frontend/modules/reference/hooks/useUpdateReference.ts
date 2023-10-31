import { FrontendReferenceService } from '@/frontend/services/reference.service'
import { Reference } from '@prisma/client'
export const useUpdateReference = () => {
  const onUpdateReference = (reference: Partial<Reference>, token: string) => {
    return FrontendReferenceService.update(reference, token)
  }
  return { onUpdateReference }
}
