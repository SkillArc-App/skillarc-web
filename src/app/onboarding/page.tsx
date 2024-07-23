'use client'

import { LoadingPage } from '@/app/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Onboarding = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Onboarding)
