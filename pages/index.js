import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
// Components
import Nav from '../components/Nav'
import Map from '../components/Map'

// Hooks
import useAuthContext from '../hooks/useAuthContext'

export default function Home() {
  const { state: authState, dispatch: authDispatch } = useAuthContext()

  const {
    authToken,
    isAuthenticated,
    merchantDetails: { id },
  } = authState

  const [login, setLogin] = React.useState({
    email: '',
    password: '',
  })
  const router = useRouter()
  async function userLogin() {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(login),
    }

    try {
      const res = await fetch(
        'http://localhost:8000/api/auth/login/merchant',
        myInit
      )

      const data = await res.json()
      // setToken(data.access_token)
      authDispatch({
        type: 'setAuthToken',
        payload: data.access_token,
      })
      authDispatch({
        type: 'setAuth',
      })
      authDispatch({
        type: 'setMerchantDetails',
        payload: data.merchant_details,
      })
      return data
    } catch (err) {
      console.log('err', err)
    }
  }

  React.useEffect(() => {
    console.log('login', login)
    console.log('authState', authState)
  }, [login, authState])

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
      // router.push('/test')
    }
  }, [isAuthenticated, router])

  return (
    <div>
      <Map />
    </div>
  )
}
