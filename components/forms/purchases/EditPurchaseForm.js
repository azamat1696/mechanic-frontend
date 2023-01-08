import React from 'react'

// Material UI
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'

// Icons
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SaveIcon from '@mui/icons-material/Save'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import { useProductsByMerchantData } from '../../../hooks/useAsyncHooks'
import { useCustomerOrders } from '../../../hooks/useOrdersHook'
import { UseProductHook } from '../../../hooks/useProductHook'
import {
  deletePurchaseOrderDetail,
  updatePurchaseOrderDetail,
  useUpdatePurchaseOrderDetail,
} from '../../../hooks/usePurchaseOrderDetailHook'

// React Query
import { useMutation } from '@tanstack/react-query'

export default function EditPurchaseForm({ purchase, open, handleClose }) {
  // Hooks
  const { state: authState } = useAuthContext()
  const { authToken } = authState
  const { data: productsData } = useProductsByMerchantData(authToken)
  const { products, setProducts } = UseProductHook(purchase)
  // Hooks

  // Local State
  const [loading, setLoading] = React.useState(false)
  const [editedProducts, setEditedProducts] = React.useState([])
  const [productsOnOrder, setProductsOnOrder] = React.useState([])
  const [updateProducts, setUpdateProducts] = React.useState({
    orderId: '',
    products: [],
  })
  const [count, setCount] = React.useState(0)
  // Local State

  const { mutate: mutateUpdate } = useMutation(
    () => updatePurchaseOrderDetail(authToken, updateProducts),
    {
      onSuccess: () => {
        console.log('success!')
        // refetchCustomerOrders()
        // setLoading(!loading)
      },
    }
  )

  React.useEffect(() => {
    if (products) {
      const prod = products.map((p, i) => {
        const found = productsData.products.find(
          (prod) => prod.id === p.productId
        )
        const obj = {
          ...p,
          isLocked: true,
          count: i,
          label: found.name,
          existing: true,
          price: found.retailPrice,
        }
        setCount(i)
        return obj
      })
      setProductsOnOrder(prod)
    }
  }, [products])

  React.useEffect(() => {
    if (productsOnOrder.length > 0) {
      const productsArray = productsOnOrder.map((item) => {
        const found = productsData.products.find((p) => p.id === item.productId)
        console.log('item 1', item)
        console.log('found 1', found)
        if (item['existing']) {
          console.log(1, item)
          return {
            orderDetailId: item.id,
            price: found.retailPrice,
            quantity: item.quantity,
            productId: item.productId,
            count: item.count,
            label: found.name,
          }
        } else {
          console.log(2, item)
          return {
            orderId: purchase.id,
            orderDetailId: null,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            count: item.count,
          }
        }
      })
      setUpdateProducts({
        orderId: purchase.id,
        products: productsArray,
      })
    }
  }, [productsOnOrder])

  React.useEffect(() => {
    const prods = purchase.purchaseDetail.map((pd, i) => {
      const found = productsData.products.find((item) => {
        console.log('purchaseDetail', pd)
        console.log('item 2', item)
        return item.id === pd.productId
      })
      console.log('found 2', found)
      return {
        ...pd,
        count: i,
        isLocked: true,
        price: found.retailPrice,
      }
    })
    setProductsOnOrder(prods)
  }, [])

  React.useEffect(() => {
    if (productsData) {
      const edited = productsData.products.map((p, i) => {
        return {
          ...p,
          label: p.name,
          count: i,
        }
      })
      setEditedProducts(edited)
    }
  }, [productsData])

  // Handlers
  function addRow() {
    setProductsOnOrder([
      ...productsOnOrder,
      {
        label: '',
        // product: { name: '' },
        quantity: 0,
        price: 0,
        productId: '',
        existing: false,
        isLocked: false,
        count: count + 1,
        orderDetailId: purchase.id,
      },
    ])
    setCount((count) => count + 1)
  }

  function handleLockState(id) {
    console.log('count id', id)
    productsOnOrder.forEach((p) => {
      if (p.count === id) {
        setProductsOnOrder([
          ...productsOnOrder.map((p, i) => {
            if (p.count === id) {
              return {
                ...p,
                isLocked: !p.isLocked,
              }
            } else {
              return {
                ...p,
              }
            }
          }),
        ])
      }
    })
  }

  function handleProductChange(e, c) {
    const { innerText } = e.target
    const found = editedProducts.find((p) => p.label === innerText)
    console.log('found', found)

    setProductsOnOrder([
      ...productsOnOrder.map((p, i) => {
        console.log('p', p)
        console.log('found', found.id)
        if (p.count === c) {
          return {
            ...p,
            label: found.name,
            productId: found.id,
            price: found.retailPrice,
          }
        } else {
          return {
            ...p,
          }
        }
      }),
    ])
  }

  function handleQuantityChange(e, od) {
    console.log('od', od)
    setProductsOnOrder([
      ...productsOnOrder.map((p) => {
        if (p.count === od.count) {
          return {
            ...od,
            quantity: Number(e.target.value),
          }
        } else {
          return {
            ...p,
          }
        }
      }),
    ])
  }
  // Handlers

  // Console Logs
  React.useEffect(() => {
    console.log('updateProducts', updateProducts)
  }, [updateProducts])
  React.useEffect(() => {
    console.log('purchase', purchase)
  }, [purchase])
  React.useEffect(() => {
    console.log('products', products)
  }, [products])
  React.useEffect(() => {
    console.log('productsOnOrder', productsOnOrder)
  }, [productsOnOrder])
  React.useEffect(() => {
    console.log('productsData', productsData)
  }, [productsData])
  React.useEffect(() => {
    console.log('editedProducts', editedProducts)
  }, [editedProducts])
  // Console Logs

  // Sub Total
  const totals = updateProducts.products.map((p) => p.quantity * p.price)
  const sub = totals.reduce((acc, val) => acc + val, 0)

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ mb: 0.5, ml: 0.85, fontSize: '28px' }}
        >
          Edit Purchase
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ mb: 2, ml: 0.85, fontSize: '23px' }}
        >
          {purchase.supplier.name}
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Button
          variant="outlined"
          onClick={addRow}
          // disabled={rowBtn}
          sx={{ mt: 2 }}
        >
          Insert Row
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        {productsOnOrder
          ? productsOnOrder.map((od, i) => {
              return (
                <div
                  key={od.count}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    disableRipple={true}
                    sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    onClick={() => handleLockState(od.count)}
                  >
                    {od.isLocked ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    disableRipple={true}
                    color="error"
                    sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    // onClick={() => {
                    //   const filtered = productsOnOrder.filter(
                    //     (p) => p.count !== od.count
                    //   )
                    //   setProductsOnOrder(filtered)
                    //   console.log('filtered', filtered)
                    //   deleteMutate(od.id)
                    // }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={editedProducts}
                    disableClearable
                    isOptionEqualToValue={(option, value) =>
                      option.label === value
                    }
                    sx={{
                      ml: 1,
                      width: 175,
                      '& .MuiFilledInput-input': {
                        height: '17.5px',
                      },
                      fontSize: '0.8rem',
                    }}
                    disabled={od.isLocked}
                    value={od.label || null}
                    onChange={(e) => handleProductChange(e, od.count)}
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" />
                    )}
                  />
                  <TextField
                    id="filled-number"
                    label="Quantity"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 115,
                      '& .MuiFilledInput-input': {
                        height: '17.5px',
                      },
                      fontSize: '0.8rem',
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: '0.9rem',
                      },
                    }}
                    disabled={od.isLocked ? true : false}
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    value={od.quantity}
                    onChange={(e) => handleQuantityChange(e, od)}
                  />
                  <TextField
                    id="filled-number"
                    label="Unit Price"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 115,
                      '& .MuiFilledInput-input': {
                        height: '17.5px',
                      },
                      fontSize: '0.8rem',
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: '0.9rem',
                      },
                    }}
                    disabled={od.isLocked ? true : false}
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    value={od.price ? od.price : 0}
                    // onChange={(e) => handlePriceChange(e, od)}
                  />
                  <TextField
                    id="filled-number"
                    label="Total Price"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 115,
                      '& .MuiFilledInput-input': {
                        height: '17.5px',
                      },
                      fontSize: '0.8rem',
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: '0.9rem',
                      },
                    }}
                    disabled={true}
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    value={od.price * od.quantity}
                    // onChange={(e) => handleQtyChange(e, row)}
                  />
                </div>
              )
            })
          : []}
      </Grid>

      <Grid
        item
        xs={12}
        sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
      >
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ mb: 0.5, ml: 0.85, fontSize: '18px', mt: 2 }}
        >
          Sub Total
        </Typography>
        <TextField
          id="filled-number"
          label="Total Price"
          type="number"
          sx={{
            ml: 1,
            width: 115,
            '& .MuiFilledInput-input': {
              height: '17.5px',
            },
            fontSize: '0.8rem',
          }}
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: '0.9rem',
            },
          }}
          disabled={true}
          InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
          variant="filled"
          value={sub}
          //   onChange={(e) => handleQtyChange(e, row)}
        />
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <LoadingButton
          // size="small"
          color="secondary"
          onClick={() => {
            console.log('mutation triggered')
            handleClose()
            mutateUpdate()
          }}
          loading={loading}
          sx={{ width: 115 }}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          // loading={loading}
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
