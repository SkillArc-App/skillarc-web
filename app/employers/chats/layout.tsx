'use client'

import { HStack } from '@chakra-ui/react'
import ChatList from 'app/chats/[id]/components/ChatList'
import { useEmployerChats } from 'app/employers/chats/hooks/useEmployerChats'
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
