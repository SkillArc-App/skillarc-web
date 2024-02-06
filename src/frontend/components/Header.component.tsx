import { Text } from '@/frontend/components/Text.component'
import { SkillArc } from '@/frontend/icons/SkillArc.icon'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useUser } from '../hooks/useUser'
import { Logo } from '../icons/Logo.icon'
import MessageCenter from './MessageCenter.component'
import NotificationCenter from './NotificationCenter'
import TestingTools from './TestingTools.component'

export const Header = () => {
  const { isLoading, isAuthenticated, logout, loginWithRedirect } = useAuth0()
  const { data: user } = useUser()

  const isAuthenticatedWithProfile = isAuthenticated && !!user?.profile?.id

  return (
    <Flex
      p="1rem"
      alignItems={'center'}
      h="64px"
      borderBottom="1px solid #E9ECEF"
      width={'100%'}
      bg={'white'}
      zIndex={'100'}
      boxShadow={'sm'}
      position={'fixed'}
      justifyContent={'space-between'}
    >
      <Flex as={NextLink} alignItems="center" gap="0.75rem" href={'/'} cursor="pointer">
        <Logo w="1.75rem" h="2rem" />
        <SkillArc w="6.75rem" h="1rem" />
      </Flex>

      <Spacer />
      <TestingTools />
      {!isLoading && !isAuthenticated && (
        <Button
          onClick={() =>
            loginWithRedirect({
              appState: {
                returnTo: window.location.href,
              },
            })
          }
        >
          Log In
        </Button>
      )}
      {isAuthenticated && <NotificationCenter />}
      {isAuthenticated && <MessageCenter />}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant={'ghost'}
        />
        <MenuList maxWidth={'16rem'}>
          {isAuthenticatedWithProfile && (
            <MenuItem as={NextLink} href={`/profiles/${user.profile.id}`}>
              My Profile
            </MenuItem>
          )}
          <MenuDivider />
          <MenuItem as={NextLink} href={`/jobs`}>
            View Jobs
          </MenuItem>
          <MenuItem as={NextLink} href={'/my_jobs/recently-viewed'}>
            Manage My Jobs
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <Stack gap={'1rem'}>
              <HStack alignItems={'start'}>
                <Avatar
                  name="Hannah"
                  src="https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg"
                />
                <Stack gap={'0rem'}>
                  <b>Need some tips?</b>
                  <p>I&apos;m Hannah! I can help you with resumes and job searching. 😊</p>
                </Stack>
              </HStack>
              <Box
                bg={'gray.800'}
                textColor={'white'}
                borderRadius={'4px'}
                textAlign={'center'}
                py={'0.5rem'}
                onClick={() => {
                  window.location.assign('https://meetings.hubspot.com/hannah-wexner')
                }}
              >
                <Text type={'b2Bold'}>Schedule a Free Call</Text>
              </Box>
            </Stack>
          </MenuItem>
          <MenuDivider />
          {isAuthenticated && (
            <MenuItem
              onClick={() =>
                logout({
                  logoutParams: { returnTo: `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/jobs` },
                })
              }
            >
              Sign Out
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  )
}
