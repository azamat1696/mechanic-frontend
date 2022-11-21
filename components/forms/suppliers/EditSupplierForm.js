import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

// Icons
import SaveIcon from '@mui/icons-material/Save'

// Hooks
import useRenderCount from '../../../hooks/useRenderCount'
import useAuthContext from '../../../hooks/useAuthContext'
import {
  updateSupplier,
  useSuppliersByMerchant,
} from '../../../hooks/useSuppliersHook'

// React Query
import { useMutation } from '@tanstack/react-query'

export default React.memo(function EditSupplierForm({
  idx,
  supplierToEdit,
  setSupplierToEdit,
  authToken,
  handleClose,
}) {
  const [loading, setLoading] = React.useState(false)

  useRenderCount('EditSupplierForm')

  const { refetch: suppliersRefetch, isStale: suppliersIsStale } =
    useSuppliersByMerchant(authToken, 'suppliersByMerchant')

  const { mutate, status, error } = useMutation(
    () => updateSupplier(authToken, supplierToEdit),
    {
      onSuccess: () => {
        if (suppliersIsStale) {
          suppliersRefetch()
        }
      },
    }
  )

  React.useEffect(() => {
    console.log('status', status)
    if (status === 'success') {
      setLoading(false)
      handleClose()
      setSupplierToEdit({
        id: '',
        name: '',
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
            <Typography variant="h5">Edit Supplier</Typography>
          </Grid>

          {/* <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={supplierToEdit.id}
              hidden={true}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={supplierToEdit.name}
              onChange={(e) =>
                setSupplierToEdit({
                  ...supplierToEdit,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => mutate(supplierToEdit)}
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
