import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Divider from '@mui/material/Divider'

// Icons
import SaveIcon from '@mui/icons-material/Save'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import { updateCustomer } from '../../../hooks/useAsyncHooks'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../pages/_app'

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

const labelStyles = {
  display: 'block',
  margin: '0 0 8.5px 0',
  fontWeight: '500',
  color: '#202024',
  fontSize: '0.95rem',
}

const cursorStyle = {
  '.MuiOutlinedInput-input': {
    cursor: 'default',
  },
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

  const { mutate, status, error } = useMutation(
    () => updateCustomer(authToken, customer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customersByMerchant'])
      },
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
            <Typography variant="h5">Edit Customer</Typography>
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
              inputProps={{
                autocomplete: 'new-password',
              }}
              value={customer.firstName}
              error={validate.firstNameError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  firstName: e.target.value,
                })
              }}
            />
            {validate.firstNameError.isError ? (
              <ul style={{ margin: '0 0 0 0', padding: 0 }}>
                {validate.firstNameError.message.map((m, i) => {
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
          <Grid item xs={5}>
            <label style={labelStyles}>Last name</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              inputProps={{
                autocomplete: 'new-password',
              }}
              value={customer.lastName}
              error={validate.lastNameError.isError}
              onChange={(e) => {
                setCustomer({
                  ...customer,
                  lastName: e.target.value,
                })
              }}
            />
            {validate.lastNameError.isError ? (
              <ul style={{ margin: '0 0 0 0', padding: 0 }}>
                {validate.lastNameError.message.map((m, i) => {
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
          <Grid item xs={5}>
            <label style={labelStyles}>Email</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              inputProps={{
                autocomplete: 'new-password',
              }}
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
          <Grid item xs={5}>
            <label style={labelStyles}>Telephone</label>
            <TextField
              id="outlined-basic"
              variant="standard"
              autoComplete="off"
              size="small"
              inputProps={{
                autocomplete: 'new-password',
              }}
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
          <Grid item xs={12} sx={{ mt: 1 }}>
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
