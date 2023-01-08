import React from 'react'

// Material UI
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import {
  useCustomersByMerchant,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../../hooks/useAsyncHooks'
import {
  createCustomerOrder,
  useCustomerOrders,
} from '../../../hooks/useOrdersHook'

// React Query
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function CreateOrderForm({ handleClose }) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const [loading, setLoading] = React.useState(false)

  const { data } = useCustomersByMerchant(authToken)
  const { data: productsData } = useProductsByMerchantData(authToken)

  const [rows, setRows] = React.useState({
    products: [],
  })
  const [count, setCount] = React.useState(0)
  const [rowBtn, setRowBtn] = React.useState(true)
  const [customerList, setCustomerList] = React.useState(null)
  const [active, setActive] = React.useState(null)

  function handleCustomerChange(e) {
    const found = customerList.find((c) => c.label === e.target.innerText)
    console.log('found', found)
    setActive(found)
  }

  function addRow() {
    setRows({
      ...rows,
      products: [
        ...rows.products,
        { label: '', id: count, quantity: '', productId: '' },
      ],
    })
    setCount(count + 1)
  }

  function deleteRow(i) {
    const r = [...rows.products]
    r.splice(i, 1)
    setRows({ ...rows, products: r })
  }

  function handleProduct(e, row) {
    const { innerText } = e.target
    const found = products.find((p) => p.name === innerText)
    console.log('found', found)
    setRows({
      ...rows,
      products: [
        ...rows.products.map((r, i) => {
          if (r.id === row.id) {
            return {
              ...r,
              label: innerText,
              productId: found.id,
              price: found.retailPrice,
            }
          } else {
            return {
              ...r,
            }
          }
        }),
      ],
    })
  }

  function handleQtyChange(e, row) {
    const { value } = e.target
    setRows({
      ...rows,
      products: [
        ...rows.products.map((r) => {
          if (r.id === row.id) {
            return {
              ...r,
              quantity: Number(value),
            }
          } else {
            return {
              ...r,
            }
          }
        }),
      ],
    })
  }

  function handlePriceChange(e, row) {
    const { value } = e.target
    setRows({
      ...rows,
      products: [
        ...rows.products.map((r) => {
          if (r.id === row.id) {
            return {
              ...r,
              price: Number(value),
            }
          } else {
            return {
              ...r,
            }
          }
        }),
      ],
    })
  }

  const { refetch: ordersRefetch } = useCustomerOrders(authToken)
  const { refetch: stockRefetch } = useStockByMerchantData(authToken, id)

  const queryClient = useQueryClient()

  const { mutate } = useMutation(
    () => createCustomerOrder(authToken, rows, active.id),
    {
      onSuccess: () => {
        setLoading(!loading)
        // queryClient.invalidateQueries([
        //   `customerOrdersByMerchant`,
        //   `stockByMerchant`,
        // ])
        ordersRefetch()
        stockRefetch()
      },
    }
  )

  const [products, setProducts] = React.useState(null)

  React.useEffect(() => {
    const { products } = productsData
    console.log('products', products)
    const p = products.map((p) => {
      return {
        ...p,
        label: p.name,
      }
    })
    setProducts(p)
  }, [productsData])

  React.useEffect(() => {
    console.log('products', products)
  }, [products])

  React.useEffect(() => {
    data &&
      setCustomerList(
        data.map((d) => {
          return {
            ...d,
            label: `${d.firstName} ${d.lastName}`,
          }
        })
      )
  }, [data])

  React.useEffect(() => {
    console.log('active', active)
  }, [active])

  React.useEffect(() => {
    console.log('customerList', customerList)
  }, [customerList])

  React.useEffect(() => {
    console.log('rows', rows)
  }, [rows])

  return (
    <Grid container spacing={2} gap={0} style={{ margin: '20px 0 0 20px' }}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ mb: 3.5, fontSize: '28px' }}
        >
          Create Order
        </Typography>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={customerList}
          sx={{
            width: 250,
            '& .MuiAutocomplete-input': { height: '17.5px' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Customer"
              InputLabelProps={{
                style: {
                  fontSize: '0.9rem',
                },
              }}
            />
          )}
          onChange={(e) => handleCustomerChange(e)}
        />
        <Button
          variant="outlined"
          onClick={addRow}
          sx={{ mt: 2 }}
          //   disabled={rowBtn}
        >
          Insert Row
        </Button>
      </Grid>
      <Grid item xs={12}>
        {rows.products !== []
          ? rows.products.map((row, i) => {
              return (
                <div
                  key={row.id}
                  style={{ display: 'flex', marginBottom: '15px' }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={products}
                    sx={{
                      width: 200,
                      '& .MuiAutocomplete-input': { height: '17.5px' },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Products"
                        InputLabelProps={{
                          style: {
                            fontSize: '0.9rem',
                          },
                        }}
                      />
                    )}
                    onChange={(e) => handleProduct(e, row)}
                  />
                  <TextField
                    id="filled-number"
                    label="Quantity"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 150,
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
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    value={row.quantity}
                    onChange={(e) => handleQtyChange(e, row)}
                  />
                  <TextField
                    id="filled-number"
                    label="Price"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 150,
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
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    value={row.price}
                    onChange={(e) => handlePriceChange(e, row)}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => deleteRow(i)}
                    sx={{ ml: 1 }}
                  >
                    X
                  </Button>
                </div>
              )
            })
          : null}
      </Grid>
      <Grid item xs={12}>
        {/* SEND JOB */}
        <LoadingButton
          size="small"
          onClick={() => {
            handleClose()
            console.log('mutation triggered')
            mutate()
          }}
          endIcon={<SendIcon />}
          //   disabled={rows.products.length === 0}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Send
        </LoadingButton>
        {/* SEND JOB */}
      </Grid>
    </Grid>
  )
}
