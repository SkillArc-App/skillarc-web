export type Chat = {
  id: string
  name: string
  messages: Message[]
  updatedAt: string
}

export type Message = {
  id: string
  createdAt: string
  text: string
  isUser: boolean
  isRead: boolean
  sender: string
}