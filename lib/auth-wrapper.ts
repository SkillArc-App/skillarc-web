import {
  useAuth0 as auth0useAuth0,
  withAuthenticationRequired as auth0WithAuthenticationRequired,
} from '@auth0/auth0-react'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions } from 'next-auth'

import {
  getSession as nextAuthGetSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession as useNextAuthSession,
} from 'next-auth/react'

const trainedSeeker = {
  id: 'clkx43oqz0000aosyp6o5bmtd',
  email: 'tom@blocktrainapp.com',
  firstName: 'Tom',
  lastName: 'Hanks',
  name: 'Tom Hanks',
  userType: 'SEEKER',
}

const untrainedSeeker = {
  id: 'cll0yrt890002aor2v4pwo4ia',
  email: 'rita@blocktrainapp.com',
  firstName: 'Rita',
  lastName: 'Wilson',
  name: 'Rita Wilson',
  userType: 'SEEKER',
}

const meghanTrainerUser = {
  id: 'cll0yrt8e0004aor228lvcp8w',
  email: 'meg@blocktrainapp.com',
  firstName: 'Meghan',
  lastName: 'Trainer',
  name: 'Meghan Trainer',
  userType: 'TRAINING_PROVIDER',
}

const billTrainerUser = {
  id: 'cll1766cz0000aons61fkc558',
  name: 'Bill Traynor',
  firstName: 'Bill',
  lastName: 'Traynor',
  email: 'bill@blocktrainapp.com',
  userType: 'TRAINING_PROVIDER',
}

const preOnboardingUser = {
  id: 'clem7u5uc0007mi0rne4h3be0',
  name: 'Jake Not-Onboard',
  firstName: 'Jake',
  lastName: 'Not-Onboard',
  email: 'jake@statefarm.com',
}

const mockedUsers = [
  trainedSeeker,
  untrainedSeeker,
  meghanTrainerUser,
  billTrainerUser,
  preOnboardingUser,
]

const user = mockedUsers.find((u) => {
  return u.id === process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH_USER_ID
})

export const getServerSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authOptions: AuthOptions,
) => {
  return { user: { id: 1 } }
}

export const getSession = async (context: GetServerSidePropsContext) => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return {
      user,
      status: 'authenticated',
    }
  } else {
    return nextAuthGetSession(context)
  }
}

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

export const useSession = () => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    return {
      data: {
        user,
      },
      status: 'authenticated',
    }
  } else {
    return useNextAuthSession()
  }
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
