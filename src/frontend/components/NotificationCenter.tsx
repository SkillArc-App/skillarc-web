import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa6'
import { useUser } from '../hooks/useUser'
import { post } from '../http-common'
import NotificationIcon from './NotificationIcon.component'
import './NotificationIcon.css'
import { Text } from './Text.component'

const NotificationCenter = () => {
  const { data: user, refetch } = useUser()
  const [notifications, setNotifications] = useState<
    {
      id: string
      notificationTitle: string
      notificationBody: string
      read: boolean
      url: string
    }[]
  >([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (user) {
      setNotifications(user.notifications)

      const unreadCount = user.notifications.filter((notification) => !notification.read).length

      setUnreadCount(unreadCount)
    }
  }, [user])

  const markNotificationsAsRead = () => {
    if (!token) return
    if (unreadCount === 0) return

    post('/notifications/mark_read', {}, token).then((_) => {
      refetch()
    })
  }

  return (
    <Box>
      <Menu isLazy>
        {({ isOpen: isClosed }) => (
          <>
            <MenuButton
              as={IconButton}
              icon={<NotificationIcon count={unreadCount} />}
              variant={'ghost'}
              onClick={() => (isClosed ? () => {} : markNotificationsAsRead())}
            />
            <MenuList>
              {notifications.map((notification, index) => (
                <MenuItem _hover={{ bg: 'transparent' }} key={index}>
                  <NotificationCard {...notification} />
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  )
}

const NotificationCard = ({
  notificationTitle,
  notificationBody,
  read,
  url,
}: {
  notificationTitle: string
  notificationBody: string
  read: boolean
  url: string
}) => {
  const router = useRouter()

  return (
    <Box
      p={'1rem'}
      bg={!read ? 'gray.100' : 'white'}
      width={'20rem'}
      borderRadius={'0.25rem'}
      border={'1px'}
      borderColor={'gray.200'}
      onClick={() => router.push(url)}
    >
      <HStack>
        <Box pr={'1rem'}>
          {!read ? <FaCircle color="red" size={'0.5rem'} /> : <Box width={'0.5rem'} />}
        </Box>
        <Stack gap={'0.5rem'}>
          <Text type={'b2Bold'}>{notificationTitle}</Text>
          <Text type={'b2'}>{notificationBody}</Text>
        </Stack>
        <Spacer />
        <ChevronRightIcon boxSize={'1.5rem'} color={'green.300'} />
      </HStack>
    </Box>
  )
}

export default NotificationCenter
