import { MixPanelEvent } from '@/common/static/APPLICATION_EVENTS'
import { http } from '../http-common'
import mixpanel from 'mixpanel-browser'

const isProduction = (): boolean => {
  return process.env.NEXT_PUBLIC_ENV === 'prod'
}

const create = async (event: MixPanelEvent) => {
  if (!isProduction()) return

  return await http.post(`/api/analytics`, event)
}

const timeEvent = async (event: string) => {
  if (!isProduction()) return
  mixpanel.time_event(event)
}

const track = async (event: string, properties?: any) => {
  if (!isProduction()) return
  mixpanel.track(event, properties)
}

export const FrontendAnalyticsService = {
  create,
  timeEvent,
  track,
}
