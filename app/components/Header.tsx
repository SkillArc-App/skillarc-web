import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Suspense } from 'react'
import { Logo } from '../icons/Logo'
import { HeaderClient } from './HeaderClient'
import MessageCenter from './MessageCenter'
import NotificationCenter from './NotificationCenter'
import { Text } from './Text.component'

function FallBackHeader() {
  return (
    <>
      <NotificationCenter notifications={[]} onClose={() => {}} />
      <MessageCenter unreadCount={0} />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant={'ghost'}
        />
        <MenuList maxWidth={'16rem'}>
          <MenuItem as={NextLink} href={`/jobs`}>
            View Jobs
          </MenuItem>
          <MenuItem as={NextLink} href={'/my-jobs/recently-viewed'}>
            Manage My Jobs
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <Stack gap={'1rem'}>
              <HStack alignItems={'start'}>
                <Avatar
                  name="Hannah"
                  src="https://www.heartlandvc.com/wp-content/uploads/2020/07/Hannah-Wexner-HVC.jpg"
                />
                <Stack gap={'0rem'}>
                  <b>Need some help?</b>
                  <p>Talk to one of SkillArc&apos;s coaches for career tips!</p>
                </Stack>
              </HStack>
              <Box
                bg={'gray.800'}
                textColor={'white'}
                borderRadius={'4px'}
                textAlign={'center'}
                py={'0.5rem'}
              >
                <Text type={'b2Bold'}>Schedule a Free Call</Text>
              </Box>
            </Stack>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export const Header = () => {
  return (
    <Flex
      p="1rem"
      alignItems={'center'}
      h="64px"
      borderBottom="1px solid #E9ECEF"
      width={'100%'}
      bg={'white'}
      zIndex={'100'}
      boxShadow={'sm'}
      position={'fixed'}
      justifyContent={'space-between'}
    >
      <Flex as={NextLink} alignItems="center" gap="0.75rem" href={'/'} cursor="pointer">
        <Logo w="1.75rem" h="2rem" />
        <Heading variant={'h3'} color={'gray.600'}>
          SkillArc
        </Heading>
      </Flex>

      <Spacer />
      <Suspense fallback={<FallBackHeader />}>
        <HeaderClient />
      </Suspense>
    </Flex>
  )
}
