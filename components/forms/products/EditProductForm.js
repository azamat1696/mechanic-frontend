import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Divider from '@mui/material/Divider'

// Icons
import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  useFindProduct,
  useUpdateProduct,
  updateSingleProduct,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../../hooks/useAsyncHooks'

// React Query
import { useMutation } from '@tanstack/react-query'

const labelStyles = {
  display: 'block',
  margin: '0 0 8.5px 3px',
  fontWeight: '500',
  color: '#202024',
  fontSize: '0.95rem',
}

export default function EditProductForm({ product, setProduct, handleClose }) {
  const [loading, setLoading] = React.useState(false)
  const {
    state: { authToken, merchantDetails },
  } = useAuthContext()

  const { refetch: productsRefetch, isStale: productsIsStale } =
    useProductsByMerchantData(authToken, 'productsByMerchant')
  const { refetch: stockRefetch, isStale: stockIsStale } =
    useStockByMerchantData(authToken, merchantDetails.id, 'stockByMerchant')

  const { mutate, status, error } = useMutation(
    () => updateSingleProduct(authToken, product),
    {
      onSuccess: () => {
        productsRefetch()
        stockRefetch()
      },
    }
  )

  React.useEffect(() => {
    if (productsIsStale) {
      productsRefetch()
    }
  }, [productsIsStale])

  React.useEffect(() => {
    console.log('status', status)
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
              onChange={(e) =>
                setProduct({
                  ...product,
                  product_code: e.target.value,
                })
              }
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
              onChange={(e) =>
                setProduct({
                  ...product,
                  retailPrice: Number(e.target.value).toFixed(2),
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <label style={labelStyles}>Image</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              disabled={true}
              value={product.image.name}
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
              onClick={() => {
                mutate(product)
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
