import * as React from 'react'

// Material UI
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Divider from '@mui/material/Divider'
import Autocomplete from '@mui/material/Autocomplete'

// Icons
import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  updateProduct,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../../hooks/useAsyncHooks'
import { useSuppliersByMerchant } from '../../../hooks/useSuppliersHook'

// React Query
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

export default function EditProductForm({ product, setProduct, handleClose }) {
  const [loading, setLoading] = React.useState(false)
  const {
    state: { authToken },
  } = useAuthContext()

  const { data } = useSuppliersByMerchant(authToken)
  const [suppliersData, setsuppliersData] = React.useState([])

  const { mutate, status, error } = useMutation(
    () => updateProduct(authToken, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`productsByMerchant`] })
        queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
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
      console.log('error', error)
    }
  }, [status])

  React.useEffect(() => {
    console.log('product', product)
  }, [product])

  React.useEffect(() => {
    console.log('data', data)
    if (data !== undefined) {
      const supplierData = data.suppliers.map((d) => {
        return {
          ...d,
          label: d.name,
        }
      })
      setsuppliersData(supplierData)
    }
  }, [data])

  React.useEffect(() => {
    console.log('data', data)
    console.log('suppliersData', suppliersData)
  }, [data, suppliersData])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} gap={0}>
          <Grid item xs={12} sx={{ mb: -1 }}>
            <Typography variant="h5">Update Product</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={4}>
            <label style={labelStyles}>Product Name</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              sx={cursorStyle}
              value={product.name}
              onChange={(e) =>
                setProduct({
                  ...product,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Manufacturer</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              sx={cursorStyle}
              value={product.manufacturer}
              onChange={(e) =>
                setProduct({
                  ...product,
                  manufacturer: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Product Code</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={product.product_code}
              sx={cursorStyle}
              onChange={(e) =>
                setProduct({
                  ...product,
                  product_code: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Supplier Name</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data !== undefined ? suppliersData : []}
              size="small"
              disableClearable={true}
              sx={cursorStyle}
              value={product.supplier.name}
              renderInput={(params) => <TextField {...params} />}
              onChange={(e) => {
                // Loops over suppliers array
                // find id that matches based on name
                console.log('supplierData', suppliersData)
                console.log('e', e.target.innerText)
                suppliersData.forEach((s) => {
                  if (e.target.innerText === s.label) {
                    setProduct({
                      ...product,
                      supplierId: s.id,
                      supplier: {
                        ...product.supplier,
                        name: s.name,
                      },
                    })
                  }
                })
              }}
            />
          </Grid>

          <Grid item xs={3}>
            <label style={labelStyles}>Cost Price</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={Number(product.costPrice).toFixed(2)}
              sx={cursorStyle}
              onChange={(e) =>
                setProduct({
                  ...product,
                  costPrice: Number(e.target.value).toFixed(2),
                })
              }
            />
          </Grid>

          <Grid item xs={3}>
            <label style={labelStyles}>Retail Price</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={Number(product.retailPrice).toFixed(2)}
              sx={cursorStyle}
              onChange={(e) =>
                setProduct({
                  ...product,
                  retailPrice: Number(e.target.value).toFixed(2),
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Min Qty</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={Number(product.minimum)}
              sx={cursorStyle}
              onChange={(e) =>
                setProduct({
                  ...product,
                  minimum: Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <label style={labelStyles}>Image</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              disabled={true}
              value={product.image}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ ml: 1 }}
            >
              <input
                hidden
                type="file"
                name="image"
                onChange={(e) => {
                  console.log('e', e.target.files[0])
                  e.preventDefault()
                  setProduct({
                    ...product,
                    image: e.target.files[0],
                  })
                }}
              />
              <PhotoCamera />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              color="secondary"
              onClick={() => mutate(product)}
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
