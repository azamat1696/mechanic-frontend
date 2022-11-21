import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

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

export default function EditProductForm({ idx, data, handleClose }) {
  const [loading, setLoading] = React.useState(false)

  const {
    state: { authToken, merchantDetails },
  } = useAuthContext()

  const [productToEdit, setProductToEdit] = React.useState({
    id: '',
    name: '',
    manufacturer: '',
    image: '',
    product_code: '',
  })

  // Update Product
  const { refetch: productsRefetch, isStale: productsIsStale } =
    useProductsByMerchantData(authToken, 'productsByMerchant')

  const { refetch: stockRefetch, isStale: stockIsStale } =
    useStockByMerchantData(authToken, merchantDetails.id, 'stockByMerchant')

  const {
    data: updatedProductData,
    isStale: productUpdateIsStale,
    refetch: productUpdateRefetch,
  } = useUpdateProduct(authToken, idx, 'updateProduct')

  const { mutate, status, error } = useMutation(
    () => updateSingleProduct(authToken, productToEdit),
    {
      onSuccess: () => {
        productsRefetch()
        stockRefetch()
        setProductToEdit({
          id: data.id,
          name: data.name,
          manufacturer: data.manufacturer,
          image: data.image,
          product_code: data.product_code,
        })
      },
    }
  )
  // Update Product

  React.useEffect(() => {
    console.log('comparison', idx, data.id)
    if (idx === data.id) {
      setProductToEdit({
        id: data.id,
        name: data.name,
        manufacturer: data.manufacturer,
        image: data.image,
        product_code: data.product_code,
      })
    }
  }, [data, idx])

  React.useEffect(() => {
    if (productsIsStale) {
      productsRefetch()
    }
  }, [productsIsStale])

  React.useEffect(() => {
    console.log('productToEdit', productToEdit)
  }, [productToEdit])

  React.useEffect(() => {
    console.log('updatedProductData', updatedProductData)
  }, [updatedProductData])

  React.useEffect(() => {
    console.log('status', status)
    if (status === 'success') {
      setLoading(false)
      handleClose()
      setProductToEdit({
        id: '',
        name: '',
        manufacturer: '',
        image: '',
        product_code: '',
      })
      //
    } else if (status === 'loading') {
      setLoading(true)
    } else if (status === 'error') {
      console.log('error', error)
    }
  }, [status])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Edit Product</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              value={productToEdit.name}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  name: e.target.value,
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
              value={productToEdit.manufacturer}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  manufacturer: e.target.value,
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
              placeholder={
                productToEdit.product_code
                  ? productToEdit.product_code
                  : 'Product Code'
              }
              value={productToEdit.product_code}
              onChange={(e) =>
                setProductToEdit({
                  ...productToEdit,
                  product_code: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                type="file"
                name="image"
                onChange={(e) => {
                  e.preventDefault()
                  setProductToEdit({
                    ...productToEdit,
                    photo: e.target.files[0],
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
                mutate(productToEdit)
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
