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
import Link from 'next/link'
import { FaCircle } from 'react-icons/fa6'
import { Notification } from '../../frontend/services/user.service'
import NotificationIcon from './NotificationIcon'
import './NotificationIcon.css'
import { Text } from './Text.component'

type NotificationCenterProps = {
  notifications: Notification[]
  onClose: () => void
}

const NotificationCenter = ({ notifications, onClose }: NotificationCenterProps) => {
  const unread = notifications.filter(({ read }) => !read)

  const items =
    notifications.length == 0 ? (
      <MenuItem>No Notifications</MenuItem>
    ) : (
      notifications.map((notification, index) => (
        <MenuItem _hover={{ bg: 'transparent' }} key={index}>
          <NotificationCard {...notification} />
        </MenuItem>
      ))
    )

  return (
    <Menu onClose={onClose}>
      <MenuButton
        as={IconButton}
        icon={<NotificationIcon count={unread.length} />}
        variant={'ghost'}
      />
      <MenuList>{items}</MenuList>
    </Menu>
  )
}

const NotificationCard = ({ notificationTitle, notificationBody, read, url }: Notification) => {
  return (
    <Box
      as={Link}
      p={'1rem'}
      bg={!read ? 'gray.100' : 'white'}
      width={'20rem'}
      borderRadius={'0.25rem'}
      border={'1px'}
      borderColor={'gray.200'}
      href={url}
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
