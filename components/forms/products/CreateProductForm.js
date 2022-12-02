import * as React from 'react'

// Material UI
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Autocomplete from '@mui/material/Autocomplete'
import Divider from '@mui/material/Divider'

// Icons
import IconButton from '@mui/material/IconButton'
import SaveIcon from '@mui/icons-material/Save'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  createProduct,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../../hooks/useAsyncHooks'

import { useSuppliersByMerchant } from '../../../hooks/useSuppliersHook'

import { useMutation } from '@tanstack/react-query'

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

export default function CreateProductForm({ handleClose }) {
  const [photo, setPhoto] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const [newProduct, setNewProduct] = React.useState({
    name: '',
    manufacturer: '',
    image: '',
    productCode: '',
    supplierId: '',
    costPrice: '',
    retailPrice: '',
    minimum: '',
  })

  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const { refetch: productsRefetch } = useProductsByMerchantData(authToken)
  const { refetch: stockRefetch } = useStockByMerchantData(authToken, id)

  const { data } = useSuppliersByMerchant(authToken)

  const [suppliers, setSuppliers] = React.useState([])

  const { mutate } = useMutation(() => createProduct(authToken, newProduct), {
    onSuccess: () => {
      setLoading(!loading)
      productsRefetch()
      stockRefetch()
    },
  })

  React.useEffect(() => {
    console.log('newProduct', newProduct)
  }, [newProduct])

  React.useEffect(() => {
    console.log('data', data)
    if (data) {
      setSuppliers(data)
    }
  }, [data])

  const [editedSuppliers, setEditedSuppliers] = React.useState([])

  React.useEffect(() => {
    if (suppliers) {
      const newArr = suppliers.map((s) => {
        return {
          ...s,
          label: s.name,
        }
      })
      setEditedSuppliers(newArr)
    }
  }, [suppliers])

  return (
    <form>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Create Product</Typography>
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
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
              sx={cursorStyle}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  productCode: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Supplier</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={editedSuppliers}
              size="small"
              renderInput={(params) => (
                <TextField {...params} sx={cursorStyle} />
              )}
              onChange={(e) => {
                editedSuppliers.forEach((s) => {
                  if (s.name === e.target.innerText) {
                    setNewProduct({
                      ...newProduct,
                      supplierId: s.id,
                    })
                  }
                })
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Cost Price</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              sx={cursorStyle}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={Number(newProduct.costPrice).toFixed(2)}
              onChange={(e) => {
                setNewProduct({
                  ...newProduct,
                  costPrice: Number(e.target.value).toFixed(2),
                })
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <label style={labelStyles}>Retail Price</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              size="small"
              type="number"
              sx={cursorStyle}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={Number(newProduct.retailPrice).toFixed(2)}
              onChange={(e) => {
                setNewProduct({
                  ...newProduct,
                  retailPrice: Number(e.target.value).toFixed(2),
                })
              }}
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
              value={Number(newProduct.minimum).toFixed(0)}
              sx={cursorStyle}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  minimum: Number(e.target.value).toFixed(0),
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
              sx={cursorStyle}
              value={newProduct.image.name}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{ ml: 1, ...cursorStyle }}
            >
              <input
                hidden
                type="file"
                name="image"
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
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
                // setLoading(!loading)
                handleClose()
                mutate(newProduct)
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
