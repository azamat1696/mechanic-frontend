import React from 'react'
import { AuthContext } from './authContext'

const initialState = {
  isAuthenticated: false,
  authToken: '',
  merchantDetails: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'setAuth':
      return {
        ...state,
        isAuthenticated: !state.auth,
      }
    case 'setAuthToken':
      return {
        ...state,
        authToken: action.payload,
      }
    case 'setMerchantDetails':
      return {
        ...state,
        merchantDetails: action.payload,
      }
    case 'reset':
      return {
        ...initialState,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
