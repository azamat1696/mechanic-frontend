import * as React from 'react'

// Material UI
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
  useSuppliersByMerchant,
  createSupplierByMerchant,
} from '../../../hooks/useSuppliersHook'

import { useMutation } from '@tanstack/react-query'

const cursorStyle = {
  '.MuiOutlinedInput-input': {
    cursor: 'default',
  },
}

export default function CreateSupplierForm({ handleClose }) {
  const [loading, setLoading] = React.useState(false)
  const [newSupplier, setNewSupplier] = React.useState({
    name: '',
  })
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const { authToken } = authState

  const { refetch: suppliersRefetch, isStale: suppliersIsStale } =
    useSuppliersByMerchant(authToken)

  const { mutate } = useMutation(
    () => createSupplierByMerchant(authToken, newSupplier),
    {
      onSuccess: () => {
        setLoading(!loading)
        suppliersRefetch()
      },
    }
  )

  React.useEffect(() => {
    console.log('newSupplier', newSupplier)
  }, [newSupplier])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Create Supplier</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              autoComplete="off"
              size="small"
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  name: e.target.value,
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
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => {
                handleClose()
                mutate(newSupplier)
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
