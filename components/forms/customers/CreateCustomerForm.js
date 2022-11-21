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

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  createNewProduct,
  createNewCustomer,
  useProductsByMerchantData,
  useStockByMerchantData,
  useCustomersByMerchant,
} from '../../../hooks/useAsyncHooks'

import { useMutation } from '@tanstack/react-query'

export default function CreateCustomerForm({ handleClose }) {
  const [loading, setLoading] = React.useState(false)
  const [customer, setCustomer] = React.useState({
    firstName: 'peter',
    lastName: 'parker',
    email: 'parker@gmail.com',
    telephone: '05488582882',
  })

  const { state: authState, dispatch } = useAuthContext()
  const { authToken } = authState

  const {
    data,
    isStale: customersIsStale,
    refetch: customersRefetch,
  } = useCustomersByMerchant(authToken, 'customersByMerchant')

  const { mutate } = useMutation(
    () => createNewCustomer(authState.authToken, customer),
    {
      onSuccess: () => {
        setLoading(!loading)
        if (customersIsStale) {
          customersRefetch()
        }
      },
    }
  )

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
            <Typography variant="h5">Create New Customer</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="First Name"
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
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Last Name"
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
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Email"
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
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Telephone"
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
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => {
                // setLoading(!loading)
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
