export type ApplicationEvents =
  | 'Onboarding Started'
  | 'Onboarding Updated'
  | 'User Login'
  | 'Page View'
  | 'User Signup'

export type MixPanelEvent = {
  name: ApplicationEvents
  properties?: Record<string, string>
}
