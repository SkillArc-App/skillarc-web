'use client'

import { useSeekerChat } from '@/app/chats/hooks/useSeekerChat'
import { IdParams } from '@/app/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import ChatWindow from './components/ChatWindow'

const Page = ({ params: { id } }: IdParams) => {
  const token = useAuthToken()

  const { data: chats = [], refetch } = useSeekerChat({
    onSuccess: async (chats) => {
      const currentChat = chats.find((chat) => chat.id === id)

      if (!currentChat) return
      if (!token) return

      const allRead = currentChat.messages.every(({ isRead }) => isRead)

      if (allRead) return

      await post(
        `/seekers/chats/mark_read`,
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
      `/seekers/chats/send_message`,
      {
        applicantId: id,
        message: text,
      },
      token,
    )

    refetch()
  }

  const currentChat = chats.find((chat) => chat.id === id)

  if (!currentChat) return <></>

  return <ChatWindow chats={chats} createMessage={createMessage} currentChat={currentChat} />
}

export default Page
