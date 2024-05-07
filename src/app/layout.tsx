'use client'

import { Header } from '@/frontend/components/Header.component'
import { initializeMixpanel } from '@/frontend/utils/mixpanel'
import { Auth0Provider } from '@auth0/auth0-react'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from '../frontend/theme/theme'
import SessionWrapper from './components/SessionWrapper'

initializeMixpanel()

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          {/* <ReactQueryDevtools /> */}

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
              <SessionWrapper>
                <Flex
                  flexWrap={'wrap'}
                  bg={'greyscale.100'}
                  flexDir={'column'}
                  height={'100vh'}
                  overscroll={'none'}
                >
                  <Header />
                  <Flex
                    flexWrap={'wrap'}
                    flexGrow={1}
                    marginTop="64px"
                    height={'calc(100% - 64px)'}
                    overflow={'scroll'}
                    overscroll={'none'}
                  >
                    {children}
                  </Flex>
                </Flex>
              </SessionWrapper>
            </ChakraProvider>
          </Auth0Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
