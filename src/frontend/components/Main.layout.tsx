import { Flex } from '@chakra-ui/react'
import { Header } from './Header.component'

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  console.log('redirect_uri', `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/auth/landing`)
  return (
    // h=100vh is what is causing a grey bar at the bottom of the desktop training provider pages
    // TODO: implement a useDevice hook and conditionally change the mainlayout per device breakpoints
    <Flex flexWrap={'wrap'} bg={'greyscale.100'} flexDir={'column'} h="100vh">
      <Header />
      <Flex h={'100%'} flexWrap={'wrap'} marginTop="64px">
        {children}
      </Flex>
    </Flex>
  )
}
