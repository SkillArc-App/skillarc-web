"use client"

import { Chat, Message } from '@/frontend/hooks/useEmployerChats'
import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Spacer,
  Stack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { MdSend } from 'react-icons/md'
import { Text } from '../../../../frontend/components/Text.component'

const ChatBubble = ({ message }: { message: Message }) => {
  const bg = message.isUser ? 'green.500' : 'gray.100'
  const align = message.isUser ? 'flex-end' : 'flex-start'
  const borderRadius = message.isUser ? '20px 20px 0 20px' : '20px 20px 20px 0'

  return (
    <Flex w="100%" justify={align}>
      <Stack align={align} maxWidth="70%" gap={0}>
        {!message.isUser && (
          <Text fontSize="xs" color="gray.500" mx={'0.5rem'}>
            {message.sender}
          </Text>
        )}
        <Box bg={bg} p={3} borderRadius={borderRadius}>
          <Text color={message.isUser ? 'white' : 'gray.800'}>{message.text}</Text>
        </Box>
      </Stack>
    </Flex>
  )
}

const ThreadItem = ({
  id,
  isCurrent,
  isUnread,
  name,
  prefix,
}: {
  id: string
  isCurrent: boolean
  isUnread: boolean
  name: string
  prefix: string
}) => {
  return (
    <Box cursor="pointer" bg={isCurrent ? 'gray.400' : ''} p={3}>
      <HStack as={Link} href={`${prefix}/${id}`}>
        <Text fontWeight="bold">{name}</Text>
        <Spacer />
        {isUnread && (
          <Box
            bg={'blue.400'}
            borderRadius={'50%'}
            flexShrink={0}
            height={'7px'}
            width={'7px'}
          ></Box>
        )}
      </HStack>
    </Box>
  )
}

const ChatScreen = ({
  serverChats,
  createMessage,
  markRead,
  id,
  prefix,
}: {
  serverChats: Chat[]
  createMessage: (id: string, text: string) => Promise<void>
  markRead: (id: string) => void
  id?: string
  prefix: string
}) => {
  const bg = useColorModeValue('gray.50', 'gray.800')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [newMessage, setNewMessage] = useState('')
  const [chats, setChats] = useState(serverChats)
  const [currentChat, setCurrentChat] = useState<Chat>()

  useEffect(() => {
    setChats(serverChats)
  }, [serverChats])

  useEffect(() => {
    if (id && chats) {
      const chat = chats.find((chat) => chat.id === id)
      if (chat) {
        setCurrentChat(chat)
      }
    }
  }, [id, chats])

  useEffect(() => {
    if (!currentChat) return

    const allRead = currentChat.messages.every((message) => message.isRead)

    if (!allRead) {
      markRead(currentChat.id)
    }
  }, [currentChat, markRead])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  const onSend = () => {
    if (!newMessage) return
    if (!chats) return
    if (!currentChat) return

    const otherChats = chats.filter((chat) => chat.id !== currentChat.id)

    const createdMessage = {
      id: '1',
      text: newMessage,
      isUser: true,
      isRead: true,
      sender: 'You',
      createdAt: new Date().toString(),
    }

    setChats([
      ...otherChats,
      {
        ...currentChat,
        messages: [...currentChat.messages, createdMessage],
      },
    ])

    createMessage(currentChat.id, newMessage)

    setNewMessage('')
  }

  useEffect(scrollToBottom, [currentChat])

  if (chats.length === 0) return <Center width={'100%'}>{'No Messages'}️</Center>

  return (
    <HStack align={'stretch'} width={'100%'}>
      <Box bg={'gray.100'} p={3} overflowY="auto">
        {(chats || [])
          .sort((a, b) => {
            return a.updatedAt > b.updatedAt ? -1 : 1
          })
          .map((chat) => {
            return (
              <ThreadItem
                key={chat.id}
                id={chat.id}
                name={chat.name}
                prefix={prefix}
                isCurrent={currentChat?.id == chat.id}
                isUnread={chat.messages.some((message) => !message.isRead)}
              />
            )
          })}
      </Box>
      {currentChat && (
        <Box bg={bg} w="100%" p={4} margin="0 auto">
          <VStack spacing={'1rem'}>
            <Flex w="100%" justify="center">
              <Text fontSize="2xl">{currentChat?.name}</Text>
            </Flex>
            <Box
              w="100%"
              h="400px"
              bg="white"
              overflowY="scroll"
              p={4}
              borderRadius={'0.5rem'}
              border={'1px'}
              borderColor={'gray.200'}
            >
              <VStack spacing={4}>
                {currentChat.messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </VStack>
              <Box ref={messagesEndRef} />
            </Box>
            <Flex w="100%">
              <Input
                bgColor={'white'}
                flex={1}
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSend()
                  }
                }}
                value={newMessage}
              />
              <IconButton
                ml={2}
                colorScheme="blue"
                aria-label="Send message"
                icon={<MdSend />}
                onClick={onSend}
              />
            </Flex>
          </VStack>
        </Box>
      )}
    </HStack>
  )
}

export default ChatScreen
