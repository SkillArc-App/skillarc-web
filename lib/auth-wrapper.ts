import {
  useAuth0 as auth0useAuth0,
  withAuthenticationRequired as auth0WithAuthenticationRequired,
} from '@auth0/auth0-react'

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'

export const signIn = async () => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return Promise.resolve()
  }

  nextAuthSignIn()
}

export const signOut = (data: any) => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return Promise.resolve()
  }

  nextAuthSignOut(data)
}

export const useAuth0 = () => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return {
      getAccessTokenSilently: () =>
        Promise.resolve(localStorage.getItem('mockNextAuth') ?? 'IAMATOKEN'),
      loginWithRedirect: () => Promise.resolve(),
      loginWithPopup: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      isAuthenticated: true,
      isLoading: false,
    }
  } else {
    return auth0useAuth0()
  }
}

export const withAuthenticationRequired = (component: any) => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return component
  } else {
    return auth0WithAuthenticationRequired(component)
  }
}
