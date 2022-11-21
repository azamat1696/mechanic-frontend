import * as React from 'react'

// Material UI
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Autocomplete from '@mui/material/Autocomplete'

// Icons
import IconButton from '@mui/material/IconButton'
import SaveIcon from '@mui/icons-material/Save'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  createNewProduct,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../../hooks/useAsyncHooks'

import { useSuppliersByMerchant } from '../../../hooks/useSuppliersHook'

import { useMutation } from '@tanstack/react-query'

export default function CreateProductForm({ handleClose }) {
  const [photo, setPhoto] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    manufacturer: '',
    image: '',
    productCode: '',
    supplierId: '',
  })
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const { refetch: productsRefetch, isStale: productsIsStale } =
    useProductsByMerchantData(authToken, 'productsByMerchant')
  const { refetch: stockRefetch, isStale: stockIsStale } =
    useStockByMerchantData(authToken, id, 'stockByMerchant')

  const { data } = useSuppliersByMerchant(authToken)

  const [suppliers, setSuppliers] = React.useState([])

  const { mutate } = useMutation(
    () => createNewProduct(authState.authToken, newProduct),
    {
      onSuccess: () => {
        setLoading(!loading)
        if (productsIsStale) {
          productsRefetch()
        }
        if (stockIsStale) {
          stockRefetch()
        }
      },
    }
  )

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
  ]

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
    console.log('editedSuppliers', editedSuppliers)
  }, [editedSuppliers])

  React.useEffect(() => {
    console.log('suppliers', suppliers)
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
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              autoComplete="off"
              size="small"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Manufacturer"
              variant="outlined"
              autoComplete="off"
              size="small"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  manufacturer: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Product code"
              variant="outlined"
              autoComplete="off"
              size="small"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  productCode: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={editedSuppliers}
              sx={{ width: 300 }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Supplier" />
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
                  setNewProduct({
                    ...newProduct,
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
