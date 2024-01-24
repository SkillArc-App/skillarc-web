'use client'

import { Box, Heading } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'

const Coaches = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box width={'100%'}>
      <Box px={'4rem'} pt={'1rem'}>
        <Heading>Coaches Dashboard</Heading>
        {children}
      </Box>
    </Box>
  )
}

export default withAuthenticationRequired(Coaches)
