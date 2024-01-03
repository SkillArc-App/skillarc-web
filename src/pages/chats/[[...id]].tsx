import { useSeekerChat } from '@/frontend/hooks/useSeekerChat'
import { post } from '@/frontend/http-common'
import ChatScreen from '@/frontend/modules/profile/components/chatScreen.component'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const chats = () => {
  const { data: chats, refetch } = useSeekerChat()

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

export default chats
