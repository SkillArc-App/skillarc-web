import FastTrackModal from '@/frontend/modules/profile/components/fastTrackModal.component'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { initializeMixpanel } from '@/frontend/utils/mixpanel'
import { Auth0Provider } from '@auth0/auth0-react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import MainLayout from '../frontend/components/Main.layout'
import { theme } from '../frontend/theme/theme'

initializeMixpanel()

export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
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

  useEffect(() => {
    const handleRouteChange = () => {
      FrontendAnalyticsService.track('Page View', {
        path: window.location.pathname,
        host: window.location.host,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Auth0Provider
        cacheLocation="localstorage"
        domain={'blocktrain.us.auth0.com'}
        clientId={'8wkkXv49JNwzrTvJaF5Rjk3hZU6lZk44'}
        onRedirectCallback={(appState) => {
          if (appState?.returnTo) {
            router.push(appState.returnTo)
          }
        }}
        authorizationParams={{
          redirect_uri: `${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/auth/landing`,
          audience: 'https://hello-world.example.com',
        }}
      >
        <ChakraProvider theme={theme}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
          <FastTrackModal />
        </ChakraProvider>
      </Auth0Provider>
    </QueryClientProvider>
  )
}
