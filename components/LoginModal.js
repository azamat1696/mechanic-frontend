import * as React from 'react'
import { useRouter } from 'next/router'

// Material UI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'

// Hooks
import useAuthContext from '../hooks/useAuthContext'
import useThemeContext from '../hooks/useThemeContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 250,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
}

export default function BasicModal() {
  const router = useRouter()
  // Modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
  }
  // Modal

  const { theme } = useThemeContext()

  // Login
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const [login, setLogin] = React.useState({
    // email: 'merchant11@gmail.com',
    // password: 'test1234',
    email: '',
    password: '',
  })

  function handleLogout() {
    authDispatch({
      type: 'reset',
    })
    router.push('/')
  }

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
      handleClose()
      return data
    } catch (err) {
      console.log('err', err)
    }
  }
  // Login

  return (
    <div>
      {authState.authToken ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
            m: 0,
          }}
        >
          <Button onClick={handleLogout} sx={{ color: '#fff', mr: 2 }}>
            Logout
          </Button>
          <Box sx={{ mb: 0.65 }}>{authState.merchantDetails.name}</Box>
        </div>
      ) : (
        <Button onClick={handleOpen} sx={{ color: '#fff' }}>
          Login
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            required
            id="outlined-required"
            label="email"
            type="email"
            // defaultValue={'merchant11@gmail.com'}
            inputProps={{
              autocomplete: 'password',
              form: {
                autocomplete: 'off',
              },
            }}
            autoComplete="off"
            size="small"
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
          <TextField
            required
            id="outlined-password-input"
            label="password"
            type="password"
            // defaultValue={'test1234'}
            autoComplete="off"
            size="small"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <Button
            variant="contained"
            onClick={userLogin}
            sx={{
              backgroundColor: theme === true ? '#3c5f83' : '#444d56',
              '&:hover': {
                backgroundColor: theme === true ? '#3c5f83' : '#444d56',
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
