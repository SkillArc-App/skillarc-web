import { Heading } from '@/frontend/components/Heading.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { IconType } from 'react-icons'

export const ProfileBox = ({
  children,
  title,
  icon,
  onAddClick,
}: {
  children: ReactNode
  title: string
  icon: IconType
  onAddClick: () => void
}) => {
  const router = useRouter()
  const { profileId } = router.query
  const {
    profileQuery: { data },
    isMyProfile,
  } = useProfileData(profileId as string)

  const Icon = icon

  return (
    <Flex
      w="100%"
      p="1rem"
      bg="greyscale.100"
      borderRadius="0.25rem"
      boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      direction="column"
    >
      <Flex w="100%" alignItems={'center'}>
        <Box color={'green.300'} marginRight={'0.75rem'}>
          <Icon size={'1.5rem'} />
        </Box>
        <Heading type="h5" color="greyscale.700" w="100%">
          {title}
        </Heading>
        {isMyProfile && (
          <Button variant={'icon'} color="greyscale.600" onClick={onAddClick}>
            <AddIcon />
          </Button>
        )}
      </Flex>
      {children}
    </Flex>
  )
}
