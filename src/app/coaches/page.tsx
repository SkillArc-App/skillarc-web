'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Coaches = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Coaches)
