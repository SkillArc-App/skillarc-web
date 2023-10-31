import { ApplicationEvents } from '@/common/static/APPLICATION_EVENTS'
import { mixpanelClient } from '../lib/mixpanel'

type AnalyticsEvent = {
  name: ApplicationEvents
  properties: any
}
const create = ({ name, properties }: AnalyticsEvent) => {
  if (process.env.NEXT_PUBLIC_ENV !== 'prod') return
  if (!name) {
    throw new Error('Missing name property in body of request')
  }
  mixpanelClient.track(name, properties)
  console.log('Analytics event: ', name, properties)
}

export const APIAnalyticsService = {
  create,
}
