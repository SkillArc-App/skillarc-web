'use client'

import { HStack } from '@chakra-ui/react'
import { useSeekerChat } from 'app/chats/hooks/useSeekerChat'
import { useParams } from 'next/navigation'
import ChatList from './[id]/components/ChatList'

const Chat = ({ children }: { children: React.ReactNode }) => {
  const { data: chats = [] } = useSeekerChat()
  const { id } = useParams()
  const currentChat = chats.find((chat) => chat.id === id)

  return (
    <HStack align={'stretch'} width={'100%'}>
      <ChatList chats={chats} prefix="/chats" currentChat={currentChat} />
      {children}
    </HStack>
  )
}

export default Chat
