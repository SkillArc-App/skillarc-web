"use client"

import ChatScreen from '@/app/profiles/[profileId]/components/chatScreen'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useSeekerChat } from '@/frontend/hooks/useSeekerChat'
import { post } from '@/frontend/http-common'

const Chats = () => {
  const { data: chats, refetch } = useSeekerChat()

  const id = useFixedParams('id')?.['id']
  const token = useAuthToken()

  const createMessage = async (id: string, text: string) => {
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/seekers/chats/send_message`,
      {
        applicant_id: id,
        message: text,
      },
      token,
    )

    refetch()
  }

  const markRead = (id: string) => {
    if (!token) return

    post(
      `${process.env.NEXT_PUBLIC_API_URL}/seekers/chats/mark_read`,
      {
        applicant_id: id,
      },
      token,
    ).then((_) => {
      refetch()
    })
  }

  if (!chats) return <></>

  return (
    <ChatScreen
      id={id}
      createMessage={createMessage}
      markRead={markRead}
      prefix="/chats"
      serverChats={chats}
    />
  )
}

export default Chats
