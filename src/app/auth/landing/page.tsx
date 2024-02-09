'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Landing = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Landing)
