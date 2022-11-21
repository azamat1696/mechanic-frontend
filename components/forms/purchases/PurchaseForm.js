import React from 'react'

// Material UI
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import Typography from '@mui/material/Typography'

// Hooks
import useAuthContext from '../../../hooks/useAuthContext'
import { useSuppliersByMerchant } from '../../../hooks/useSuppliersHook'
import { createPurchaseOrder } from '../../../hooks/usePurchaseOrderHook'
import { useMutation } from '@tanstack/react-query'

export default function PurchaseForm({ handleClose }) {
  // CONTEXT
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState
  // CONTEXT

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
  // STATE

  // REACT QUERY
  const { data } = useSuppliersByMerchant(authToken)

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

  function handleSupplierChange(e) {
    const { innerText } = e.target
    console.log('test', activeSupplier, innerText)

    const foundSupplier = supplier.find((s) => s.name === innerText)
    console.log('supplierId', foundSupplier.id)

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
    console.log('foundProduct', foundP)
    // console.log('foundRow', foundR)

    setRows({
      ...rows,
      products: [
        ...rows.products.map((r) => {
          if (r.id === row.id) {
            return {
              ...r,
              label: innerText,
              productId: foundP.id,
              supplierId: foundP.supplierId,
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
    // onSuccess: () => {
    //   setLoading(!loading)
    //   if (customersIsStale) {
    //     customersRefetch()
    //   }
    // },
  })

  React.useEffect(() => {
    console.log('rows', rows)
  }, [rows])

  React.useEffect(() => {
    data &&
      setSupplier(
        data.map((d) => {
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
    console.log('supplier', supplier)
  }, [supplier])

  React.useEffect(() => {
    let actSP
    if (activeSupplier !== undefined) {
      actSP = supplier.filter((s) => {
        if (s.name === activeSupplier) {
          console.log('matched', s.name, activeSupplier)
          return s
        }
      })

      const productEdits = actSP[0].products.map((p) => {
        return {
          ...p,
          label: p.name,
        }
      })
      setActiveSP(productEdits)
    }
  }, [activeSupplier, supplier])

  React.useEffect(() => {
    console.log('activeSupplier', activeSupplier)
  }, [activeSupplier])

  React.useEffect(() => {
    console.log('activeSP', activeSP)
  }, [activeSP])

  React.useEffect(() => {
    console.log('test rowBtn', rowBtn)
    console.log('test activeSupplier', activeSupplier)
  }, [rowBtn, activeSupplier, rows.products])

  return (
    <Grid container spacing={2} gap={0} style={{ margin: '20px 0 0 20px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3.5 }}>
          Purchase Order
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={supplier}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Supplier" />}
          onChange={(e) => handleSupplierChange(e)}
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
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Products" />
                    )}
                    onChange={(e) => handleSupplierProducts(e, row)}
                  />
                  {/* QUANTITY */}
                  <TextField
                    id="filled-number"
                    label="Quantity"
                    type="number"
                    sx={{ ml: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{ inputProps: { min: 0, defaultValue: 0 } }}
                    variant="filled"
                    onChange={(e) => handleQtyChange(e, row)}
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
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          disabled={rows.products.length === 0}
          onClick={() => mutate()}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  )
}
