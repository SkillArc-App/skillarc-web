'use client'

import { LoadingPage } from '@/components/Loading'
import { Text } from '@/components/Text.component'
import { useUser } from '@/hooks/useUser'
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()

  const { data: user, isLoading } = useUser()

  if (isLoading) return <LoadingPage />
  if (!user) return <div>Unauthorized</div>
  if (!user.userRoles?.some((ur) => ur.role.name === 'admin')) {
    return <div>Unauthorized</div>
  }

  const adminLinks = [
    {
      name: 'Attributes',
      path: '/admin/attributes',
    },
    {
      name: 'Trainer Invites',
      path: '/admin/trainer-invites',
    },
    {
      name: 'Training Providers',
      path: '/admin/training-providers',
    },
    {
      name: 'Employer Invites',
      path: '/admin/employer-invites',
    },
    {
      name: 'Employers',
      path: '/admin/employers',
    },
    {
      name: 'Jobs',
      path: '/admin/jobs',
    },
  ]

  return (
    <Box width={'100%'}>
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={'50px 1fr 30px'}
        gridTemplateColumns={'150px 1fr'}
        h="xl"
        gap="1"
        color="blackAlpha.700"
      >
        <GridItem pl="2" area={'header'}>
          <Heading>Admin</Heading>
        </GridItem>
        <GridItem pl="2" bg="white" area={'nav'}>
          <Box>
            <Text variant={'b1Bold'}>Operations</Text>
            {adminLinks.map((link, index) => {
              return (
                <Box key={index} bg={pathName === link.path ? 'gray.300' : ''}>
                  <Link href={link.path}>{link.name}</Link>
                </Box>
              )
            })}
          </Box>
        </GridItem>
        <GridItem pl="2" bg="white" area={'main'}>
          {children}
        </GridItem>
        <GridItem pl="2" bg="white" area={'footer'}></GridItem>
      </Grid>
    </Box>
  )
}

export default withAuthenticationRequired(AdminLayout)
