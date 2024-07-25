'use client'

import { LoadingPage } from '@/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Landing = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Landing)
