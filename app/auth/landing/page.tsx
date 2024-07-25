'use client'

import { LoadingPage } from 'app/components/Loading'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Landing = () => {
  return <LoadingPage />
}

export default withAuthenticationRequired(Landing)
