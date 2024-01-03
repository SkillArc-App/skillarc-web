import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FaInbox } from 'react-icons/fa'
import { useSeekerChat } from '../hooks/useSeekerChat'
import { useUser } from '../hooks/useUser'
import BadgeIcon from './BadgeIcon.component'

const MessageCenter = () => {
  const router = useRouter()

  const { data: chat } = useSeekerChat()
  const { data: user } = useUser()

  const unreadCount =
    chat?.filter((chat) => !chat.messages.every((message) => message.isRead)).length ?? 0

  if (!user?.profile.id) {
    return <></>
  }

  return (
    <Box cursor="pointer" className="notification-wrapper" px={'0rem'}>
      <BadgeIcon Icon={FaInbox} count={unreadCount} onClick={() => router.push('/chats')} />
    </Box>
  )
}

export default MessageCenter
