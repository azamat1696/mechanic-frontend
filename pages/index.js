import React from 'react'
import { useRouter } from 'next/router'

// Components
import MapBox from '../components/MapBox'

// Hooks
import useAuthContext from '../hooks/useAuthContext'

export default function Home() {
  const { state: authState } = useAuthContext()
  const { isAuthenticated } = authState

  const router = useRouter()

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  console.log('system environment', process.env.NODE_ENV)
  console.log('next environment', process.env.NEXT_PUBLIC_ENV)
  console.log('next NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL)

  return <MapBox />
}
