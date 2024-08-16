'use client'

import { Header } from '@/components/Header'
import { Auth0Provider } from '@auth0/auth0-react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { sendGTMEvent } from '@next/third-parties/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import SessionWrapper from './components/SessionWrapper'
import { theme } from './theme/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}

      <Auth0Provider
        cacheLocation="localstorage"
        domain={'blocktrain.us.auth0.com'}
        clientId={'8wkkXv49JNwzrTvJaF5Rjk3hZU6lZk44'}
        onRedirectCallback={(appState) => {
          sendGTMEvent({ event: 'login' })
          router.replace(appState && appState.returnTo ? appState.returnTo : window.location.href)
        }}
        authorizationParams={{
          redirect_uri: `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/auth/landing`,
          audience: 'https://hello-world.example.com',
        }}
      >
        <CacheProvider>
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
        </CacheProvider>
      </Auth0Provider>
    </QueryClientProvider>
  )
}
