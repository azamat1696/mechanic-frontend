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
import {
  useOrderDetailsData,
  useUpdateOrderDetail,
  deleteOrderDetail,
  updateOrderDetail,
} from '../../../hooks/useOrderDetailHook'
import { useCustomerOrders } from '../../../hooks/useOrdersHook'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../pages/_app'

const orderStatus = ['Waiting', 'In Progress', 'Complete']

export default React.memo(function EditOrderForm({ order, handleClose }) {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  // Hooks
  const { data: productsData } = useProductsByMerchantData(authToken)
  // const { data: customerOrdersData, refetch: refetchCustomerOrders } =
  //   useCustomerOrders(authToken)
  const { data: orderDetailData, refetch: refetchOrderDetailData } =
    useOrderDetailsData(authToken, order.id)

  // Loading
  const [loading, setLoading] = React.useState(false)

  // Rows
  const [count, setCount] = React.useState(0)

  const [products, setProducts] = React.useState([])
  const [editedProducts, setEditedProducts] = React.useState([])
  const [productsOnOrder, setProductsOnOrder] = React.useState([])
  const [updateProducts, setUpdateProducts] = React.useState({
    orderId: '',
    status: '',
    products: [],
  })

  const { mutate: deleteMutate } = useMutation(
    (id) => deleteOrderDetail(authToken, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`customerOrdersByMerchant`],
        })
      },
    }
  )

  const { mutate: mutateUpdate } = useMutation(
    () => updateOrderDetail(authToken, updateProducts),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`customerOrdersByMerchant`],
        })
        queryClient.invalidateQueries({
          queryKey: [`orderDetailByOrder`],
        })
        setLoading(!loading)
      },
    }
  )

  React.useEffect(() => {
    if (productsOnOrder.length > 0) {
      const productsArray = productsOnOrder.map((item) => {
        console.log('item', item)
        if (item['existing']) {
          return {
            orderDetailId: item.id,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            count: item.count,
          }
        } else {
          return {
            orderId: item.id,
            orderDetailId: null,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            count: item.count,
          }
        }
      })
      setUpdateProducts({
        orderId: order.id,
        status: order ? order.status : null,
        products: productsArray,
      })
    }
  }, [productsOnOrder])

  React.useEffect(() => {
    console.log('order', order)
  }, [order])

  React.useEffect(() => {
    console.log('updateProducts', updateProducts)
  }, [updateProducts])

  React.useEffect(() => {
    if (authToken) {
      refetchOrderDetailData()
    }
  }, [authToken])

  React.useEffect(() => {
    if (orderDetailData) {
      setProducts(orderDetailData.orderDetail)
      console.log('orderDetailData', orderDetailData)
    }
  }, [orderDetailData])

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
        setCount(i)
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
        product: { name: '' },
        quantity: 0,
        price: 0,
        productId: '',
        existing: false,
        isLocked: false,
        count: count + 1,
        id: order.id,
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

  function handlePriceChange(e, od) {
    console.log('od', od)
    setProductsOnOrder([
      ...productsOnOrder.map((p) => {
        if (p.count === od.count) {
          return {
            ...od,
            price: Number(e.target.value),
          }
        } else {
          return {
            ...p,
          }
        }
      }),
    ])
  }

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

  React.useEffect(() => {
    console.log('productsOnOrder', productsOnOrder)
  }, [productsOnOrder])

  // Sub Total
  const totals = updateProducts.products.map((p) => p.quantity * p.price)
  const sub = totals.reduce((acc, val) => acc + val, 0)

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
      <Grid
        item
        xs={1.5}
        sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}
      >
        Status:
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={orderStatus}
          disableClearable
          // isOptionEqualToValue={(option, value) => option.label === value}
          sx={{
            ml: 1,
            width: 145,
            // p: 0,
            // backgroundColor: 'red',
            '& .MuiFilledInput-input': {
              height: '10px',
            },
            fontSize: '0.85rem',
          }}
          // disabled={od.isLocked}
          value={updateProducts.status || null}
          onChange={(e) => {
            console.log('e.target.value', e.target.innerText)
            setUpdateProducts({
              ...updateProducts,
              status: e.target.innerText,
            })
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </Grid>
      <Grid xs={12}>
        <Button
          variant="outlined"
          onClick={addRow}
          // disabled={rowBtn}
          sx={{ mt: 4, mb: 1 }}
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
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'self-end',
                    // backgroundColor: 'yellow',
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    disableRipple={true}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                    onClick={() => handleLockState(od.count)}
                  >
                    {od.isLocked ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    disableRipple={true}
                    color="error"
                    sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    onClick={() => {
                      const filtered = productsOnOrder.filter(
                        (p) => p.count !== od.count
                      )
                      setProductsOnOrder(filtered)
                      console.log('filtered', filtered)
                      deleteMutate(od.id)
                    }}
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
                      <TextField
                        {...params}
                        variant="standard"
                        label="Product"
                      />
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
                    variant="standard"
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
                    variant="standard"
                    value={od.price}
                    onChange={(e) => handlePriceChange(e, od)}
                  />
                  <TextField
                    id="filled-number"
                    label="Line Price"
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
                    variant="standard"
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
          {/* Total */}
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
          variant="standard"
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
          // loading={loading}
          sx={{ width: 115 }}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          loading={loading}
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  )
})
