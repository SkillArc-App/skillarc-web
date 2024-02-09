'use client'

import ChatScreen from '@/app/profiles/[profileId]/components/chatScreen'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useEmployerChats } from '@/frontend/hooks/useEmployerChats'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { post } from '@/frontend/http-common'
import { useEffect } from 'react'

const ChatUI = () => {
  const { data: serverChats, refetch: refetchChats } = useEmployerChats()

  const id = useFixedParams('id')?.['id']
  const token = useAuthToken()

  useEffect(() => {
    const createChat = (applicantId: string) => {
      if (!token) return

      post(
        `${process.env.NEXT_PUBLIC_API_URL}/employers/chats`,
        {
          applicant_id: applicantId,
        },
        token,
      ).then((_) => {
        refetchChats()
      })
    }

    if (id && serverChats) {
      const chat = serverChats.find((chat) => chat.id === id)
      if (!chat) {
        createChat(id)
      }
    }
  }, [id, refetchChats, serverChats, token])

  const createMessage = async (id: string, text: string) => {
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/chats/send_message`,
      {
        applicant_id: id,
        message: text,
      },
      token,
    )

    refetchChats()
  }

  const markRead = (id: string) => {
    if (!token) return

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/chats/mark_read`,
      {
        applicant_id: id,
      },
      token,
    ).then((_) => {
      refetchChats()
    })
  }

  if (!serverChats) return <></>

  return (
    <ChatScreen
      id={id}
      createMessage={createMessage}
      markRead={markRead}
      prefix="/employers/chats"
      serverChats={serverChats}
    />
  )
}

export default ChatUI
