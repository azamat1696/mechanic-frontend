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
  updateCustomer,
  useCustomersByMerchant,
} from '../../../hooks/useAsyncHooks'

// React Query
import { useMutation } from '@tanstack/react-query'

const listStyleFirst = {
  margin: '5px 0 0 20px',
  padding: 0,
  fontSize: '0.85rem',
  listStyle: 'square',
}

const listStyleSecond = {
  margin: '12px 0 0 20px',
  padding: 0,
  fontSize: '0.85rem',
  listStyle: 'square',
}

export default React.memo(function EditCustomerForm({
  handleClose,
  customer,
  setCustomer,
}) {
  const {
    state: { authToken },
  } = useAuthContext()

  const [loading, setLoading] = React.useState(false)

  const initialValidationState = {
    firstNameError: {
      message: [],
      isError: false,
    },
    lastNameError: {
      message: [],
      isError: false,
    },
    emailError: {
      message: [],
      isError: false,
    },
    telephoneError: {
      message: [],
      isError: false,
    },
  }

  const [validate, setValidate] = React.useState(initialValidationState)

  const { refetch: customersRefetch } = useCustomersByMerchant(authToken)

  const { mutate, status, error } = useMutation(
    () => updateCustomer(authToken, customer),
    {
      onSuccess: () => customersRefetch(),
      onError: (error) => {
        if (error.body.message) {
          let firstNameErrors = []
          let lastNameErrors = []
          let emailErrors = []
          let telephoneErrors = []

          error.body.message.forEach((m) => {
            if (m.includes('firstName')) {
              firstNameErrors.push(m)
            }
          })

          error.body.message.forEach((m) => {
            if (m.includes('lastName')) {
              lastNameErrors.push(m)
            }
          })

          error.body.message.forEach((m) => {
            if (m.includes('email')) {
              emailErrors.push(m)
            }
          })

          error.body.message.forEach((m) => {
            if (m.includes('telephone')) {
              telephoneErrors.push(m)
            }
          })

          setValidate({
            ...validate,
            firstNameError: {
              ...validate.firstNameError,
              message: [...firstNameErrors],
              isError: firstNameErrors.length === 0 ? false : true,
            },
            lastNameError: {
              ...validate.lastNameError,
              message: [...lastNameErrors],
              isError: lastNameErrors.length === 0 ? false : true,
            },
            emailError: {
              ...validate.emailError,
              message: [...emailErrors],
              isError: emailErrors.length === 0 ? false : true,
            },
            telephoneError: {
              ...validate.telephoneError,
              message: [...telephoneErrors],
              isError: telephoneErrors.length === 0 ? false : true,
            },
          })
        }
      },
    }
  )

  React.useEffect(() => {
    if (status === 'success') {
      setLoading(false)
      handleClose()
    } else if (status === 'loading') {
      setLoading(true)
    } else if (status === 'error') {
      setLoading(false)
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
              value={customer.firstName}
              error={validate.firstNameError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  firstName: e.target.value,
                })
              }}
            />
          </Grid>
          {validate.firstNameError.isError ? (
            <ul style={{ margin: '0 0 0 0', padding: 0 }}>
              {validate.firstNameError.message.map((m, i) => {
                return (
                  <li key={i} style={i > 0 ? listStyleFirst : listStyleSecond}>
                    {m}
                  </li>
                )
              })}
            </ul>
          ) : null}
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.lastName}
              error={validate.lastNameError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  lastName: e.target.value,
                })
              }}
            />
          </Grid>
          {validate.lastNameError.isError ? (
            <ul style={{ margin: '0 0 0 0', padding: 0 }}>
              {validate.lastNameError.message.map((m, i) => {
                return (
                  <li key={i} style={i > 0 ? listStyleFirst : listStyleSecond}>
                    {m}
                  </li>
                )
              })}
            </ul>
          ) : null}
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.email}
              error={validate.emailError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }}
            />
            {validate.emailError.isError ? (
              <ul style={{ margin: '0 0 0 0', padding: 0 }}>
                {validate.emailError.message.map((m, i) => {
                  return (
                    <li
                      key={i}
                      style={i > 0 ? listStyleFirst : listStyleSecond}
                    >
                      {m}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={customer.telephone}
              error={validate.telephoneError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  telephone: e.target.value,
                })
              }}
            />
            {validate.telephoneError.isError ? (
              <ul style={{ margin: '0 0 0 0', padding: 0 }}>
                {validate.telephoneError.message.map((m, i) => {
                  return (
                    <li
                      key={i}
                      style={i > 0 ? listStyleFirst : listStyleSecond}
                    >
                      {m}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => mutate(customer)}
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
