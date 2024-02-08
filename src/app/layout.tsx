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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=supreme@501,2,800,400,401,200,100,300,101,301,500,201,801,1,701,700&display=swap"
          rel="stylesheet"
          ></link>*/}
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
