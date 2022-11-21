import React from 'react'
import { AuthContext } from '../context/authContext'

export default function useAuthContext() {
  const authContext = React.useContext(AuthContext)
  const { state, dispatch } = authContext

  return {
    state,
    dispatch,
  }
}
