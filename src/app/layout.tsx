'use client'

import { initializeMixpanel } from '@/frontend/utils/mixpanel'
import { Auth0Provider } from '@auth0/auth0-react'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from '../frontend/theme/theme'
import { Header } from '@/frontend/components/Header.component'

initializeMixpanel()

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  const router = useRouter()

  return (
    <html lang="en">
      <head>
        <title>SkillArc</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />

          <Auth0Provider
            cacheLocation="localstorage"
            domain={'blocktrain.us.auth0.com'}
            clientId={'8wkkXv49JNwzrTvJaF5Rjk3hZU6lZk44'}
            onRedirectCallback={(appState) => {
              router.replace(
                appState && appState.returnTo ? appState.returnTo : window.location.href,
              )
            }}
            authorizationParams={{
              redirect_uri: `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/auth/landing`,
              audience: 'https://hello-world.example.com',
            }}
          >
            <ChakraProvider theme={theme}>
              <Flex flexWrap={'wrap'} bg={'greyscale.100'} flexDir={'column'} h="100vh">
                <Header />
                <Flex h={'100%'} flexWrap={'wrap'} marginTop="64px">
                  {children}
                </Flex>
              </Flex>
            </ChakraProvider>
          </Auth0Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
