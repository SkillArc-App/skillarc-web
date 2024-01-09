import { useEmployerChats } from '@/frontend/hooks/useEmployerChats'
import { post } from '@/frontend/http-common'
import ChatScreen from '@/frontend/modules/profile/components/chatScreen.component'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ChatUI = () => {
  const { data: serverChats, refetch: refetchChats } = useEmployerChats()

  const router = useRouter()
  const { id: idWrapper } = router.query
  const id = idWrapper?.at(0)

  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

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
    };

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
