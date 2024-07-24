import { Chat } from '@/app/common/types/Chat'
import { Box, HStack, Spacer, Text } from '@chakra-ui/react'
import Link from 'next/link'

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

type ChatListProp = {
  chats: Chat[]
  prefix: string
  currentChat?: Chat
}

export default function ChatList({ chats, prefix, currentChat }: ChatListProp) {
  return (
    <Box bg={'gray.100'} p={3} overflowY="auto">
      {chats
        .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
        .map((chat) => (
          <ThreadItem
            key={chat.id}
            id={chat.id}
            name={chat.name}
            prefix={prefix}
            isCurrent={currentChat?.id == chat.id}
            isUnread={chat.messages.some((message) => !message.isRead)}
          />
        ))}
    </Box>
  )
}
