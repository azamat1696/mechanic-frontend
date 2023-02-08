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
import { useSuppliersByMerchant } from '../../../hooks/useSuppliersHook'
import {
  createPurchaseOrder,
  usePurchaseOrder,
} from '../../../hooks/usePurchaseOrderHook'
import { useStockByMerchantData } from '../../../hooks/useAsyncHooks'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../pages/_app'

export default function PurchaseForm({ handleClose, setO: setOpen }) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const { authToken } = authState

  // STATE
  const [rows, setRows] = React.useState({
    supplierId: '',
    products: [],
  })
  const [supplier, setSupplier] = React.useState([])
  const [activeSupplier, setActiveSupplier] = React.useState(undefined)
  const [activeSP, setActiveSP] = React.useState([])
  const [count, setCount] = React.useState(0)
  const [rowBtn, setRowBtn] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  // STATE

  // REACT QUERY
  const { data } = useSuppliersByMerchant(authToken)

  function addRow() {
    setRows({
      ...rows,
      products: [
        ...rows.products,
        { label: '', id: count, quantity: '', productId: '', price: '' },
      ],
    })
    setCount(count + 1)
  }

  function deleteRow(i) {
    const r = [...rows.products]
    r.splice(i, 1)
    setRows({ ...rows, products: r })
  }

  function handleSupplierChange(e) {
    const { innerText } = e.target
    console.log('test', activeSupplier, innerText)

    const foundSupplier = supplier.find((s) => s.name === innerText)
    console.log('supplierId', foundSupplier.id, supplier)

    if (activeSupplier !== innerText) {
      setActiveSupplier(innerText)
      setRows({
        ...rows,
        supplierId: foundSupplier.id,
        products: [],
      })
    } else if (activeSupplier === innerText) {
      setActiveSupplier(innerText)
    }
  }

  function handleSupplierProducts(e, row) {
    const { innerText, value } = e.target
    const foundP = activeSP.find((p) => p.name === innerText)
    const foundR = rows.products.find((r) => r.id === row.id)

    // console.log("id's", row.id, i)
    // console.log('foundProduct', foundP)
    // console.log('foundRow', foundR)

    setRows({
      ...rows,
      products: [
        ...rows.products.map((r) => {
          console.log('r', r)
          if (r.id === row.id) {
            return {
              ...r,
              label: innerText,
              productId: foundP.id,
              supplierId: foundP.supplierId,
              price: foundP.retailPrice,
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

  const { mutate } = useMutation(() => createPurchaseOrder(authToken, rows), {
    onSuccess: () => {
      setLoading(!loading)
      queryClient.invalidateQueries({ queryKey: [`ordersByMerchant`] })
      queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
      setOpen(true)
    },
  })

  // React.useEffect(() => {
  //   console.log('poData', poData)
  // }, [poData])

  // React.useEffect(() => {
  //   console.log('rows', rows)
  // }, [rows])

  React.useEffect(() => {
    data &&
      setSupplier(
        data.suppliers.map((d) => {
          console.log('d', d)
          return {
            ...d,
            label: d.name,
            supplierId: d.id,
          }
        })
      )
  }, [data])

  React.useEffect(() => {
    queryClient.refetchQueries({
      queryKey: [`suppliersByMerchant`],
      type: 'active',
      exact: true,
    })
  }, [])

  // React.useEffect(() => {
  //   console.log('supplier', supplier)
  // }, [supplier])

  React.useEffect(() => {
    let actSP
    if (activeSupplier !== undefined) {
      console.log('x supplier', supplier)
      actSP = supplier.filter((s) => {
        if (s.name === activeSupplier) {
          console.log('matched', s.name, activeSupplier)
          return s
        }
      })

      console.log('x actSP', actSP)

      const productEdits = actSP[0].products.map((p) => {
        return {
          ...p,
          label: p.name,
        }
      })
      setActiveSP(productEdits)
    }
  }, [activeSupplier, supplier])

  // React.useEffect(() => {
  //   console.log('activeSupplier', activeSupplier)
  // }, [activeSupplier])

  React.useEffect(() => {
    console.log('activeSP', activeSP)
  }, [activeSP])

  React.useEffect(() => {
    console.log('rows', rows)
  }, [rows])
  // React.useEffect(() => {
  //   console.log('test rowBtn', rowBtn)
  //   console.log('test activeSupplier', activeSupplier)
  // }, [rowBtn, activeSupplier, rows.products])

  return (
    <Grid container spacing={2} gap={0} style={{ margin: '20px 0 0 20px' }}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ mb: 3.5, fontSize: '28px' }}
        >
          Purchase Order
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={supplier}
          sx={{
            width: 250,
            '& .MuiAutocomplete-input': { height: '17.5px' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier"
              InputLabelProps={{
                style: {
                  fontSize: '0.9rem',
                },
              }}
            />
          )}
          onChange={(e) => handleSupplierChange(e)}
          disableClearable={true}
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
              // console.log('Row Index', i)
              return (
                <div
                  key={row.id}
                  style={{ display: 'flex', marginBottom: '14px' }}
                >
                  {/* PRODUCT */}
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={activeSP}
                    sx={{
                      width: 250,
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
                    onChange={(e) => handleSupplierProducts(e, row)}
                  />
                  {/* QUANTITY */}
                  <TextField
                    id="filled-number"
                    label="Quantity"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 125,
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
                    onChange={(e) => handleQtyChange(e, row)}
                  />
                  <TextField
                    id="filled-number"
                    label="Price"
                    type="number"
                    sx={{
                      ml: 1,
                      width: 125,
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
                    value={
                      rows.products.length > 0 ? rows.products[row.id].price : 0
                    }
                    // onChange={(e) => handlePriceChange(e, row)}
                  />
                  {/* DELETE ROW */}
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
          : 'no rows'}
      </Grid>
      <Grid item xs={12}>
        {/* SEND ORDER */}
        <LoadingButton
          size="small"
          onClick={() => {
            handleClose()
            mutate()
          }}
          endIcon={<SendIcon />}
          disabled={rows.products.length === 0}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Send
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
