import { Chat, Message } from '@/frontend/hooks/useEmployerChats'
import {
  Box,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { MdSend } from 'react-icons/md'

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

type ChatProps = {
  chats: Chat[]
  currentChat: Chat
  createMessage: (id: string, message: string) => Promise<void>
}

export default function ChatWindow({ chats, currentChat, createMessage }: ChatProps) {
  const [newMessage, setNewMessage] = useState('')

  const bg = useColorModeValue('gray.50', 'gray.800')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const onSend = async () => {
    if (!newMessage) return
    if (!chats) return
    if (!currentChat) return

    await createMessage(currentChat.id, newMessage)
    setNewMessage('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [currentChat])

  return (
    <Box bg={bg} w="100%" p={4} margin="0 auto">
      <VStack spacing={'1rem'}>
        <Flex w="100%" justify="center">
          <Text fontSize="2xl">{currentChat.name}</Text>
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
  )
}
