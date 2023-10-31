import mixpanel, { Mixpanel } from 'mixpanel'

const globalForMixPanel = global as unknown as { mixpanelClient: Mixpanel }

export const mixpanelClient =
  globalForMixPanel.mixpanelClient || mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!)

if (process.env.NEXT_PUBLIC_ENV !== 'prod') globalForMixPanel.mixpanelClient = mixpanelClient
