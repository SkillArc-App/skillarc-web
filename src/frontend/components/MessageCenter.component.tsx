import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FaInbox } from 'react-icons/fa'
import { useUser } from '../hooks/useUser'
import BadgeIcon from './BadgeIcon.component'
import { useSeekerChat } from '@/app/chats/hooks/useSeekerChat'

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
      <BadgeIcon icon={FaInbox} count={unreadCount} onClick={() => router.push('/chats')} />
    </Box>
  )
}

export default MessageCenter
