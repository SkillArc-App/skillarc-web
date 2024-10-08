'use client'

import ChatList from '@/chats/[id]/components/ChatList'
import { useEmployerChats } from '@/employers/chats/hooks/useEmployerChats'
import { HStack } from '@chakra-ui/react'
import { useParams } from 'next/navigation'

const Chat = ({ children }: { children: React.ReactNode }) => {
  const { data: chats = [] } = useEmployerChats()
  const { id } = useParams()
  const currentChat = chats.find((chat) => chat.id === id)

  return (
    <HStack align={'stretch'} width={'100%'}>
      <ChatList chats={chats} prefix="/employers/chats" currentChat={currentChat} />
      {children}
    </HStack>
  )
}

export default Chat
