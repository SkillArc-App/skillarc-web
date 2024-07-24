'use client'

import ChatWindow from '@/app/chats/[id]/components/ChatWindow'
import { useEmployerChats } from '@/app/employers/chats/hooks/useEmployerChats'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import { useEffect } from 'react'

const ChatUI = ({ params: { id } }: IdParams) => {
  const token = useAuthToken()

  const { data: chats = [], refetch: refetchChats } = useEmployerChats({
    onSuccess: async (chats) => {
      const currentChat = chats.find((chat) => chat.id === id)

      if (!currentChat) return
      if (!token) return

      const allRead = currentChat.messages.every(({ isRead }) => isRead)

      if (allRead) return

      await post(
        `/employers/chats/mark_read`,
        {
          applicantId: id,
        },
        token,
      )
    },
  })

  const createMessage = async (id: string, text: string) => {
    if (!token) return

    await post(
      `/employers/chats/send_message`,
      {
        applicantId: id,
        message: text,
      },
      token,
    )

    refetchChats()
  }

  const currentChat = chats.find((chat) => chat.id === id)

  useEffect(() => {
    const createChat = async (applicantId: string) => {
      if (!token) return

      await post(
        `/employers/chats`,
        {
          applicantId: applicantId,
        },
        token,
      )

      refetchChats()
    }

    if (id && chats && !currentChat) {
      createChat(id)
    }
  }, [id, refetchChats, chats, token, currentChat])

  if (!currentChat) return <></>

  return <ChatWindow chats={chats} createMessage={createMessage} currentChat={currentChat} />
}

export default ChatUI
