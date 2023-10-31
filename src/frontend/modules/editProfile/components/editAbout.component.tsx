import { Story } from '@/common/types/Profile'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { useUpdateMyProfile } from '../hooks/useUpdateProfile'

export const EditAbout = () => {
  const router = useRouter()
  const { data: user } = useUser()
  const {
    updateStory: { mutate: updateStory },
    addStory: { mutate: addStory },
    deleteStory: { mutate: deleteStory },
  } = useUpdateMyProfile()

  const [storyList, setStoryList] = useState<Story[]>([])
  const [isPromptScreenOpen, setIsPromptScreenOpen] = useState(false)
  const promptOptions = [
    'What are you most passionate about?',
    'What are you complimented on most in your work?',
    'What is something about you that makes you a good worker?',
    'What is the most significant driver that motivates you?',
    'Where do you see yourself in 5 years?',
    'What are you happiest doing?',
    'What’s your personal motto?',
    'Tell us about an obstacle you have overcome',
    'Tell us about a learning experience',
    'What hobbies do you have?',
    'What causes do you care about?',
    'What career or personal goals would you like to achieve in the next few years?',
    'Where did you learn your skills?',
  ]

  useEffect(() => {
    setStoryList(user?.profile?.stories ?? [])
  }, [user])

  const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const temp = [...storyList]
    temp[index].response = e.target.value
    setStoryList(temp)
  }

  const handleAdd = (prompt: string) => {
    console.log('handleAdd: ', prompt)
    setStoryList([...storyList, { prompt, response: '', id: '' }])
  }

  const handleDelete = (index: number) => {
    const temp = [...storyList]
    const deletedElement = temp.splice(index, 1)
    if (deletedElement[0].id !== '') {
      deleteStory({ id: deletedElement[0].id, profile_id: user?.profile?.id ?? '' })
    }
    setStoryList(temp)
  }

  const handleSave = () => {
    // if (!user || !user.profile || !user.profile.id) return
    const profileId = user?.profile?.id
    if (!profileId) return

    storyList.map((story, index) => {
      if (story.id === '') {
        addStory({
          profileId: profileId,
          story: {
            prompt: story.prompt,
            response: story.response,
          },
        })
      } else {
        updateStory({
          prompt: story.prompt ?? '',
          response: story.response ?? '',
          id: story.id,
          profile_id: profileId,
        })
      }
    })

    router.back()
  }
  if (isPromptScreenOpen === false) {
    return (
      <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
        <Heading variant="h2">Edit About</Heading>
        {storyList.map((story, index) => {
          return (
            <Flex
              p="1rem"
              bg="white"
              gap="1rem"
              flexDir="column"
              borderRadius="4px"
              boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
              key={index}
            >
              <Text type="b2">{story.prompt}</Text>
              <Textarea
                defaultValue={story.response}
                onChange={(e) => handleResponseChange(e, index)}
              />

              <Flex w={'100%'} gap="1rem">
                <Button variant={'remove'} w={'100%'} onClick={() => handleDelete(index)}>
                  Remove
                </Button>
                {/* <Button variant={'secondary'} w={'100%'}>
                  Replace
                </Button> */}
              </Flex>
            </Flex>
          )
        })}

        <Flex flexDir="column" gap="1rem">
          <Button
            variant="secondary"
            onClick={() => {
              setIsPromptScreenOpen(true)
            }}
          >
            Add another
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Flex>
      </Flex>
    )
  } else {
    return (
      <Flex bg={'greyscale.100'} height={'100%'} width={'100%'}>
        <Flex flexDir={'column'} px={'1rem'} py={'1rem'} gap={'0.5rem'}>
          <Flex flexDir={'column'} gap={'1rem'}>
            <>
              {promptOptions.map((option, index) => {
                return (
                  <Button
                    whiteSpace="initial"
                    padding="16px"
                    h="min-content"
                    bg="white"
                    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
                    w="100%"
                    onClick={() => {
                      handleAdd(option)
                      setIsPromptScreenOpen(false)
                    }}
                    key={index}
                  >
                    <Text type="b1" color="greyscale.600">
                      {option}
                    </Text>
                  </Button>
                )
              })}
            </>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
