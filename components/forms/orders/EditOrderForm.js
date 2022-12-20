import React from 'react'

// Material UI
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
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
import {
  useOrderDetailsData,
  deleteOrderDetail,
} from '../../../hooks/useOrderDetailHook'

// React Query
import { useMutation } from '@tanstack/react-query'

export default function EditOrderForm({ order, open }) {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const { data: productsData } = useProductsByMerchantData(authToken)
  const [editedProducts, setEditedProducts] = React.useState([])

  const {
    data: orderDetailData,
    refetch: refetchOrderDetailData,
    isFetchedAfterMount,
    isFetching,
    isFetched,
    status,
    isloading,
  } = useOrderDetailsData(authToken, order.id)

  const [products, setProducts] = React.useState([])
  const [productsOnOrder, setProductsOnOrder] = React.useState([])
  const [newRow, setNewRow] = React.useState([])
  const [subTotal, setSubTotal] = React.useState(null)

  const [count, setCount] = React.useState(0)

  const { mutate } = useMutation((id) => deleteOrderDetail(authToken, id), {
    onSuccess: () => console.log('delete success!'),
  })

  // React.useEffect(() => {
  //   console.log('order', order)
  // }, [order])

  // React.useEffect(() => {
  //   console.log('productsData', productsData)
  // }, [productsData])

  React.useEffect(() => {
    if (!open) {
      setProductsOnOrder([])
    }
  }, [open])

  // Total Price Calculation
  React.useEffect(() => {
    if (orderDetailData) {
      const productTotals = orderDetailData.orderDetail.map(
        (i) => i.quantity * i.price
      )
      if (productTotals.length > 0) {
        const total = productTotals.reduce((acc, curr) => acc + curr)
        setSubTotal(total)
      } else {
        setSubTotal(0)
      }
    }
  }, [orderDetailData])

  // Checks if Auth Token has changed
  React.useEffect(() => {
    if (authToken) {
      refetchOrderDetailData()
    }
  }, [authToken])

  // Step 0 => Get order id from orders table
  // Step 1 => Set order details to products state
  React.useEffect(() => {
    if (orderDetailData) {
      setProducts(orderDetailData.orderDetail)
      console.log('orderDetailData', orderDetailData)
    }
  }, [orderDetailData])

  // Step 2 => Add count + locked state to existing rows from order details
  React.useEffect(() => {
    if (products) {
      const prod = products.map((p, i) => {
        const obj = {
          ...p,
          isLocked: true,
          count: i,
          label: p.product.name,
          existing: true,
        }
        setCount(count + 1)
        return obj
      })
      setProductsOnOrder(prod)
    }
  }, [products])

  function addRow() {
    setProductsOnOrder([
      ...productsOnOrder,
      {
        label: '',
        // id: count + 1,
        product: { name: '' },
        quantity: 0,
        price: 0,
        productId: '',
        existing: false,
        isLocked: false,
        count: count + 1,
      },
    ])
    setCount(count + 1)
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

  function handleProductSelection(e, c) {
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
          }
        } else {
          return {
            ...p,
            // label: found.name,
          }
        }
      }),
    ])
    // Get array where existing & newly added products exist
  }

  // Set label key products data so that autocomplete component can render products list
  React.useEffect(() => {
    if (productsData) {
      const edited = productsData.products.map((p) => {
        return {
          ...p,
          label: p.name,
          count: count + 1,
        }
      })
      setEditedProducts(edited)
    }
  }, [productsData])

  // React.useEffect(() => {
  //   console.log('editedProducts', editedProducts)
  // }, [editedProducts])

  React.useEffect(() => {
    console.log('productsOnOrder', productsOnOrder)
  }, [productsOnOrder])

  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ mb: 0.5, ml: 0.85, fontSize: '28px' }}
        >
          Edit Order
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ mb: 2, ml: 0.85, fontSize: '23px' }}
        >
          {order.user.email}
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
                    onClick={() => mutate(od.id)}
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
                    onChange={(e) => handleProductSelection(e, od.count)}
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
                    //   onChange={(e) => handleQtyChange(e, row)}
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
                    value={od.price}
                    //   onChange={(e) => handleQtyChange(e, row)}
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
                    //   onChange={(e) => handleQtyChange(e, row)}
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
          value={subTotal}
          //   onChange={(e) => handleQtyChange(e, row)}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
        <LoadingButton
          // size="small"
          color="secondary"
          // onClick={handleClick}
          // loading={loading}
          sx={{ width: 115 }}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
