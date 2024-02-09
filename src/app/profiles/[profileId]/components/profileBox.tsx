import { Maybe } from '@/common/types/maybe'
import { Heading } from '@/frontend/components/Heading.component'
import { Box, Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { IconType } from 'react-icons'
import { BlAddIcon } from './blAddIcon'

export const ProfileBox = ({
  children,
  title,
  isProfileEditor,
  icon: Icon,
  ctaHref,
}: {
  children: ReactNode
  title: string
  isProfileEditor: Maybe<boolean>
  icon: IconType
  ctaHref: string
}) => {
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
        {isProfileEditor && (
          <Button as={Link} variant={'ghost'} href={ctaHref}>
            <BlAddIcon />
          </Button>
        )}
      </Flex>
      {children}
    </Flex>
  )
}
