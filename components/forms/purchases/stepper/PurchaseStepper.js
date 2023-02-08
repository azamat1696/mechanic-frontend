import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'

// Hooks
import useAuthContext from '../../../../hooks/useAuthContext'
import { useSuppliersByMerchant } from '../../../../hooks/useSuppliersHook'
import { createPurchaseOrder } from '../../../../hooks/usePurchaseOrderHook'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../../pages/_app'

const steps = ['Select Supplier', 'Select Products', 'Create Order']

export default function PurchaseStepper({ handleClose }) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [disableNext, setDisableNext] = React.useState(false)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const { data } = useSuppliersByMerchant(authToken)

  const [suppliersData, setSuppliersData] = React.useState({
    suppliers: [],
    selectedSupplierName: null,
    selectedSupplierId: null,
    selectedSupplierProducts: [],
    selectedSupplierChosenProducts: [],
  })

  const [left, setLeft] = React.useState([])
  const [right, setRight] = React.useState([])

  React.useEffect(() => {
    if (data !== undefined) {
      const newSupArr = data.suppliers.map((s) => {
        return {
          ...s,
          label: s.name,
        }
      })
      setSuppliersData({
        ...suppliersData,
        suppliers: newSupArr,
      })
    }
  }, [data])

  React.useEffect(() => {
    console.log('suppliersData', suppliersData)
  }, [suppliersData])

  React.useEffect(() => {
    console.log('left', left)
    if (suppliersData !== undefined) {
      setLeft(suppliersData.selectedSupplierProducts)
    }
  }, [suppliersData.selectedSupplierName])

  React.useEffect(() => {
    console.log('activeStep', activeStep)
    if (activeStep === 1 && right.length === 0) {
      setDisableNext(true)
    } else {
      setDisableNext(false)
    }
  }, [activeStep, right])

  React.useEffect(() => {
    if (suppliersData.selectedSupplierName === null) {
      setDisableNext(true)
    } else {
      setDisableNext(false)
    }
  }, [suppliersData.selectedSupplierName])

  const { mutate } = useMutation(
    () =>
      createPurchaseOrder(authToken, {
        supplierId: suppliersData.selectedSupplierId,
        products: suppliersData.selectedSupplierChosenProducts,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`ordersByMerchant`] })
        queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
        setTimeout(() => handleClose(), 1000)
      },
    }
  )

  React.useEffect(() => {
    if (activeStep === 3) {
      mutate()
    }
  }, [activeStep])

  const supplierProps = {
    suppliersData,
    setSuppliersData,
  }

  const transferProps = {
    left,
    right,
    setLeft,
    setRight,
    suppliersData,
    setSuppliersData,
  }

  const productsProps = {
    suppliersData,
    setSuppliersData,
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          {/* Final Step */}
          <Typography sx={{ textAlign: 'center', margin: '30px 0 30px 0' }}>
            Your order has been created!
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* Content */}
          <Box sx={{ height: 'max-content' }}>
            {activeStep === 0 && <SupplierList {...supplierProps} />}
            {activeStep === 1 && <TransferList {...transferProps} />}
            {activeStep === 2 && <ChosenProductsList {...productsProps} />}
          </Box>
          {/* Lower Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} disabled={disableNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
            {/* Lower Buttons */}
          </Box>
        </React.Fragment>
      )}
    </Box>
  )
}

function SupplierList({ suppliersData, setSuppliersData }) {
  function getSupplierId(name, arr) {
    const supplier = arr.find((s) => s.name === name)
    return supplier.id
  }

  function getSupplierProducts(name, arr) {
    const supplier = arr.find((s) => s.name === name)
    return supplier.products
  }

  return (
    <Box sx={{ mt: 5, ml: 1 }}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={suppliersData.suppliers}
        sx={{ width: 275 }}
        disableClearable="true"
        renderInput={(params) => <TextField {...params} label="Supplier" />}
        value={
          suppliersData.selectedSupplierName !== null
            ? suppliersData.selectedSupplierName
            : ''
        }
        onChange={(e) => {
          console.log('e', e)
          const { innerText } = e.target
          setSuppliersData({
            ...suppliersData,
            selectedSupplierName: innerText,
            selectedSupplierId: getSupplierId(
              innerText,
              suppliersData.suppliers
            ),
            selectedSupplierProducts: getSupplierProducts(
              innerText,
              suppliersData.suppliers
            ),
            selectedSupplierChosenProducts: [],
          })
        }}
      />
    </Box>
  )
}

function TransferList({
  left,
  right,
  setLeft,
  setRight,
  suppliersData,
  setSuppliersData,
}) {
  const [checked, setChecked] = React.useState([])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          // console.log('value', value)
          const labelId = `transfer-list-all-item-${value}-label`

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItem>
          )
        })}
      </List>
    </Card>
  )

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1)
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1)
  }

  function union(a, b) {
    return [...a, ...not(b, a)]
  }

  React.useEffect(() => {
    setSuppliersData({
      ...suppliersData,
      selectedSupplierChosenProducts: right,
    })
  }, [right])

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 3, mb: 3 }}
    >
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
    </Grid>
  )
}

function ChosenProductsList({ suppliersData, setSuppliersData }) {
  function addQuantity(id, num) {
    const newArr = suppliersData.selectedSupplierChosenProducts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          quantity: Number(num),
        }
      } else {
        return {
          ...p,
        }
      }
    })
    return newArr
  }

  function getQuantity(id) {
    const found = suppliersData.selectedSupplierChosenProducts.find(
      (p) => p.id === id
    )

    if (!found['quantity']) {
      return 0
    } else {
      return found.quantity
    }
  }

  function getLinePrice(id) {
    const found = suppliersData.selectedSupplierChosenProducts.find(
      (p) => p.id === id
    )
    console.log('found 2', found)
    if (found['quantity']) {
      return found.quantity * found.retailPrice
    } else {
      return 0
    }
  }

  function getTotalPrice() {
    const totalsArr = suppliersData.selectedSupplierChosenProducts.map((p) => {
      if (p['quantity']) {
        return p.quantity * p.retailPrice
      } else {
        return 0
      }
    })
    console.log('totalsArr', totalsArr)

    if (totalsArr.length > 0) {
      const ttl = totalsArr.reduce((acc, curr) => acc + curr)
      console.log('ttl', ttl)
      return ttl
    } else {
      return 0
    }
  }

  return (
    <Box sx={{ mt: 4, mb: 1 }}>
      {suppliersData.selectedSupplierChosenProducts.map((p) => {
        return (
          <Box
            key={p.id}
            sx={{
              // mt: 5,
              // mb: 2,
              display: 'flex',
              justifyContent: 'end',
              p: 0,
              mb: 1,
            }}
          >
            <TextField
              id="filled-basic"
              label="Product"
              variant="filled"
              value={p.name}
              disabled="true"
              size="small"
              sx={{ width: 245 }}
            />
            <TextField
              id="filled-number"
              label="Quantity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              value={getQuantity(p.id)}
              size="small"
              sx={{ ml: 2, width: 125 }}
              onChange={(e) => {
                if (e.target.value < 0) {
                  return
                } else {
                  setSuppliersData({
                    ...suppliersData,
                    selectedSupplierChosenProducts: addQuantity(
                      p.id,
                      e.target.value
                    ),
                  })
                }
              }}
            />
            <TextField
              id="filled-number"
              label="Price"
              type="number"
              disabled="true"
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              value={p.retailPrice}
              size="small"
              sx={{ ml: 2, width: 125 }}
            />
            <TextField
              id="filled-number"
              label="Line price"
              type="number"
              disabled="true"
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              value={getLinePrice(p.id)}
              size="small"
              sx={{ ml: 2, width: 125 }}
            />
          </Box>
        )
      })}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <TextField
          id="filled-number"
          label="Total"
          type="number"
          disabled="true"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          value={getTotalPrice()}
          size="small"
          sx={{ ml: 0, width: 125 }}
        />
      </Box>
    </Box>
  )
}
