import '../styles/globals.css'
import Layout from '../components/Layout'

// Context
import { AuthProvider } from '../context/authProvider'
// import { VisualModeProvider } from '../context/themeProvider'

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <VisualModeProvider> */}
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
      {/* </VisualModeProvider> */}
    </QueryClientProvider>
  )
}

export default MyApp
