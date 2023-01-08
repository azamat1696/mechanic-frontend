import React from 'react'

// Components
import Nav from '../components/Nav'
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Nav />
      {children}
    </div>
  )
}
