'use client'

import { initializeMixpanel } from '@/frontend/utils/mixpanel'
import { Auth0Provider } from '@auth0/auth0-react'
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import MainLayout from '../frontend/components/Main.layout'
import { theme } from '../frontend/theme/theme'

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

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />

          <Auth0Provider
            cacheLocation="localstorage"
            domain={'blocktrain.us.auth0.com'}
            clientId={'8wkkXv49JNwzrTvJaF5Rjk3hZU6lZk44'}
            // onRedirectCallback={(appState) => {
            // if (appState?.returnTo) {
            //   router.push(appState.returnTo)
            // }
            // }}
            authorizationParams={{
              redirect_uri: `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/auth/landing`,
              audience: 'https://hello-world.example.com',
            }}
          >
            <ChakraProvider theme={theme}>
              <MainLayout>{children}</MainLayout>
            </ChakraProvider>
          </Auth0Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
