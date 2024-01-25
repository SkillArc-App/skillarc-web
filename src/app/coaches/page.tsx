'use client'

import { Box } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Coaches = () => {
  return <Box width={'100%'}>SUP!</Box>
}

export default withAuthenticationRequired(Coaches)
