import { MixPanelEvent } from '@/common/static/APPLICATION_EVENTS'
import { useMutation } from 'react-query'
import { FrontendAnalyticsService } from '../services/analytics.service'

export const useAnalytics = () => {
  // full useMutation return object
  const trackMutationReturn = useMutation((event: MixPanelEvent) =>
    FrontendAnalyticsService.create(event),
  )
  // destructure the mutate function for convenience
  const track = trackMutationReturn.mutate

  return { track, trackMutationReturn }
}
