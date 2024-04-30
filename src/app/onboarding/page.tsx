'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Onboarding = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Onboarding)
