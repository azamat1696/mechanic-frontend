import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

// Icons
import SaveIcon from '@mui/icons-material/Save'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  updateSingleCustomer,
  useCustomersByMerchant,
} from '../../../hooks/useAsyncHooks'
import useRenderCount from '../../../hooks/useRenderCount'

// React Query
import { useMutation } from '@tanstack/react-query'

export default React.memo(function EditCustomerForm({
  idx,
  customerToEdit,
  setCustomerToEdit,
  authToken,
  handleClose,
}) {
  const [loading, setLoading] = React.useState(false)

  useRenderCount('EditCustomerForm')

  const { refetch: customersRefetch, isStale: customersIsStale } =
    useCustomersByMerchant(authToken, 'customersByMerchant')

  // Update Customer
  const { mutate, status, error } = useMutation(
    () => updateSingleCustomer(authToken, customerToEdit),
    {
      onSuccess: () => {
        customersRefetch()
      },
    }
  )

  // Update Customer

  React.useEffect(() => {
    console.log('status', status)
    if (status === 'success') {
      setLoading(false)
      handleClose()
      setCustomerToEdit({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
      })
    } else if (status === 'loading') {
      setLoading(true)
    } else if (status === 'error') {
      setLoading(false)
      console.log('error', error)
    }
  }, [status])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Update Customer</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customerToEdit.firstName}
              // placeholder={customerToEdit.firstName}
              onChange={(e) =>
                setCustomerToEdit({
                  ...customerToEdit,
                  firstName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customerToEdit.lastName}
              // placeholder={customerToEdit.lastName}
              onChange={(e) =>
                setCustomerToEdit({
                  ...customerToEdit,
                  lastName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              // placeholder={customerToEdit.email}
              value={customerToEdit.email}
              onChange={(e) =>
                setCustomerToEdit({
                  ...customerToEdit,
                  email: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              // placeholder={customerToEdit.telephone}
              value={customerToEdit.telephone}
              onChange={(e) =>
                setCustomerToEdit({
                  ...customerToEdit,
                  telephone: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => {
                mutate(customerToEdit)
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
})
