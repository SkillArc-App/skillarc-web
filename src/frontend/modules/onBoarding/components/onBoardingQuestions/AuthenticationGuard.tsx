import { withAuthenticationRequired } from '@auth0/auth0-react'

export const AuthenticationGuard = ({ children }: any) => {
  const Component = withAuthenticationRequired(children, {
    onRedirecting: () => <div>Redirecting you to the login page...</div>,
  })

  return <Component />
}
