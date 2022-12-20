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

import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'

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

  const {
    data,
    isStale: customersIsStale,
    refetch: customersRefetch,
  } = useCustomersByMerchant(authToken, 'customersByMerchant')

  const queryClient = useQueryClient()

  const { mutate } = useMutation(() => createCustomer(authToken, customer), {
    onSuccess: () => {
      setLoading(!loading)
      // customersRefetch()
      queryClient.invalidateQueries(['customersByMerchant'])
    },
  })

  React.useEffect(() => {
    console.log('data', data)
  }, [data])

  React.useEffect(() => {
    console.log('customer', customer)
  }, [customer])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Create Customer</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <label style={labelStyles}>First name</label>
            <TextField
              id="outlined-basic"
              // label="First Name"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  firstName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <label style={labelStyles}>Last name</label>
            <TextField
              id="outlined-basic"
              // label="Last Name"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  lastName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <label style={labelStyles}>Email</label>
            <TextField
              id="outlined-basic"
              // label="Email"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <label style={labelStyles}>Telephone</label>
            <TextField
              id="outlined-basic"
              // label="Telephone"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.telephone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  telephone: e.target.value,
                })
              }
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
