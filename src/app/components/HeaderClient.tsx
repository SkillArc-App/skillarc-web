'use client'

import Cal from '@calcom/embed-react'
import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import TestingTools from '../../frontend/components/TestingTools.component'
import { Text } from '../../frontend/components/Text.component'
import { useUser } from '../../frontend/hooks/useUser'
import { useSeekerChat } from '../chats/hooks/useSeekerChat'
import MessageCenter from './MessageCenter'
import NotificationCenter from './NotificationCenter'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'

export const HeaderClient = () => {
  const { isLoading, isAuthenticated, logout, loginWithRedirect } = useAuth0()
  const { data: user, refetch } = useUser()
  const { data: chat } = useSeekerChat()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const token = useAuthToken()

  const notifications = user?.notifications ?? []
  const unread = notifications.filter(({ read }) => !read)

  const markNotificationsAsRead = () => {
    if (!token) return
    if (!unread) return

    post('/notifications/mark_read', {}, token).then((_) => {
      refetch()
    })
  }

  const unreadCount =
    chat?.filter((chat) => !chat.messages.every((message) => message.isRead)).length ?? 0

  const isAuthenticatedWithProfile = isAuthenticated && !!user?.profile?.id

  return (
    <>
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
      <NotificationCenter notifications={notifications} onClose={markNotificationsAsRead} />
      <MessageCenter unreadCount={unreadCount} />
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
          {isAuthenticatedWithProfile && <MenuDivider />}
          <MenuItem as={NextLink} href={`/jobs`}>
            View Jobs
          </MenuItem>
          <MenuItem as={NextLink} href={'/my-jobs/recently-viewed'}>
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
                  <b>Need some help?</b>
                  <p>Talk to one of SkillArc&apos;s coaches for career tips!</p>
                </Stack>
              </HStack>
              <Box
                bg={'gray.800'}
                textColor={'white'}
                borderRadius={'4px'}
                textAlign={'center'}
                py={'0.5rem'}
                onClick={onOpen}
              >
                <Text type={'b2Bold'}>Schedule a Free Call</Text>
              </Box>
            </Stack>
          </MenuItem>
          {isAuthenticated && <MenuDivider />}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="60rem">
          <ModalHeader>Schedule Time with a Coach</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Cal
              calLink="team/skillarc/career-consultation"
              style={{ width: '100%', height: '100%', overflow: 'scroll' }}
              config={{ layout: 'month_view', theme: 'light' }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
