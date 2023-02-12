import React from 'react'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import { updateMerchDetails } from '../../../hooks/useMerchantHook'
// MUI
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../pages/_app'

export function Settings() {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const [loading, setLoading] = React.useState(false)

  const { merchantDetails } = authState

  const [merchDetails, setMerchDetails] = React.useState({
    name: merchantDetails.name,
    email: merchantDetails.email,
    telephone: merchantDetails.telephone,
    address1: merchantDetails.address1,
    address2: merchantDetails.address2,
    address3: merchantDetails.address3,
  })

  const { mutate } = useMutation(
    () => updateMerchDetails(authState.authToken, merchDetails),
    {
      onSuccess: () => {
        console.log('success')
        //   queryClient.invalidateQueries({ queryKey: [`ordersByMerchant`] })
        //   queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
      },
    }
  )

  React.useEffect(() => {
    console.log('authState', authState)
    console.log('merchDetails', merchDetails)
  }, [authState, merchDetails])

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">Merchant Settings</Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2, mb: 3 }}>
          <Divider />
        </Grid>
        <Grid item xs={4}>
          <label style={labelStyles}>Merchant Name</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.name}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                name: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <label style={labelStyles}>Email</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            type="email"
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.email}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                email: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <label style={labelStyles}>Telephone</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.telephone}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                telephone: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 4 }}>
          <label style={labelStyles}>Address Line 1</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            autoComplete="off"
            sx={cursorStyle}
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.address1}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                address1: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <label style={labelStyles}>Address Line 2</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            autoComplete="off"
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.address2}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                address2: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <label style={labelStyles}>Address Line 3</label>
          <TextField
            id="standard-basic"
            variant="standard"
            size="small"
            autoComplete="off"
            inputProps={{
              autocomplete: 'new-password',
            }}
            value={merchDetails.address3}
            onChange={(e) => {
              setMerchDetails({
                ...merchDetails,
                address3: e.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <LoadingButton
            color="secondary"
            onClick={() => {
              console.log('clicked')
              mutate()
            }}
            // loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  )
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
