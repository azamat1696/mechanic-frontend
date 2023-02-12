import * as React from 'react'

// Material UI
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

// Icons
import IconButton from '@mui/material/IconButton'
import SaveIcon from '@mui/icons-material/Save'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Divider from '@mui/material/Divider'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  createCustomer,
  useCustomersByMerchant,
} from '../../../hooks/useAsyncHooks'

import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../pages/_app'

const labelStyles = {
  display: 'block',
  margin: '0 0 8.5px 3px',
  fontWeight: '500',
  color: '#202024',
  fontSize: '0.95rem',
}

const cursorStyle = {
  '.MuiOutlinedInput-input': {
    cursor: 'default',
  },
}

export default function CreateCustomerForm({ handleClose }) {
  const [loading, setLoading] = React.useState(false)
  const [customer, setCustomer] = React.useState({
    // firstName: 'peter',
    // lastName: 'parker',
    // email: 'parker@gmail.com',
    // telephone: '05488582882',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
  })

  const { state: authState, dispatch } = useAuthContext()
  const { authToken } = authState

  const { mutate } = useMutation(() => createCustomer(authToken, customer), {
    onSuccess: () => {
      setLoading(!loading)
      queryClient.invalidateQueries(['customersByMerchant'])
    },
  })

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Create Customer</Typography>
          </Grid>
          <Grid item xs={12} sx={{ mt: 1, mb: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={5}>
            <label style={labelStyles}>First name</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              type="text"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  firstName: e.target.value,
                })
              }
              sx={cursorStyle}
              inputProps={{
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <label style={labelStyles}>Last name</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              type="text"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  lastName: e.target.value,
                })
              }
              sx={cursorStyle}
              inputProps={{
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <label style={labelStyles}>Email</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
              sx={cursorStyle}
              inputProps={{
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <label style={labelStyles}>Telephone</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              type="tel"
              value={customer.telephone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  telephone: e.target.value,
                })
              }
              sx={cursorStyle}
              inputProps={{
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <LoadingButton
              color="secondary"
              onClick={() => {
                handleClose()
                mutate(customer)
              }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}
