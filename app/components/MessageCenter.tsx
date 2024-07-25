import { IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { FaInbox } from 'react-icons/fa'
import BadgeIcon from './BadgeIcon'

export default function MessageCenter({ unreadCount }: { unreadCount: number }) {
  return (
    <IconButton
      cursor="pointer"
      aria-label="messages"
      href={'/chats'}
      as={Link}
      icon={<BadgeIcon icon={FaInbox} count={unreadCount} />}
    />
  )
}
