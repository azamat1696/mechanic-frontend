import React from 'react'
import { useRouter } from 'next/router'

// Components
import StockTable from '../components/Tables/StockTable'
import ProductsTable from '../components/Tables/ProductsTable'
import CustomersTable from '../components/Tables/CustomersTable'
import PurchasesTable from '../components/Tables/PurchasesTable'
import SuppliersTable from '../components/Tables/SuppliersTable'
import OrdersTable from '../components/Tables/OrdersTable'
import NestedList from '../components/NestedList'

// Hooks
import useAuthContext from '../hooks/useAuthContext'
import {
  useStockByMerchantData,
  useProductsByMerchantData,
  useCustomersByMerchant,
} from '../hooks/useAsyncHooks'
import { useSuppliersByMerchant } from '../hooks/useSuppliersHook'
import { usePurchaseOrder } from '../hooks/usePurchaseOrderHook'
import { useCustomerOrders } from '../hooks/useOrdersHook'

// Material UI
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default React.memo(function Dashboard() {
  const router = useRouter()

  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const [loading, setLoading] = React.useState(false)
  const [stockLoading, setStockLoading] = React.useState(false)

  //
  const [purchaseOrder, setPurchaseOrder] = React.useState({
    id: null,
    data: null,
  })

  function handlePurchaseSelection(params) {
    const { id } = params.row
    setPurchaseOrder({ id, data: params.row })
  }
  //

  const {
    authToken,
    isAuthenticated,
    merchantDetails: { id },
  } = authState

  const {
    data: stockData,
    status: stockStatus,
    error: stockError,
    isStale: stockIsStale,
    refetch: stockRefetch,
    isFetching: stockIsFetching,
  } = useStockByMerchantData(authToken, id)

  const {
    data: productsData,
    status: productsStatus,
    error: productError,
    isStale: productsIsStale,
    refetch: productsRefetch,
  } = useProductsByMerchantData(authToken)

  const {
    data: customersData,
    status: customersStatus,
    error: customersError,
    isStale: customersIsStale,
    refetch: customersRefetch,
  } = useCustomersByMerchant(authToken)

  const {
    data: suppliersData,
    status: suppliersStatus,
    error: suppliersError,
    isStale: suppliersIsStale,
    refetch: suppliersRefetch,
  } = useSuppliersByMerchant(authToken)

  const {
    data: purchaseOrdersData,
    status: purchaseOrdersStatus,
    error: purchaseOrdersError,
    isStale: purchaseOrdersIsStale,
    refetch: purchaseOrdersRefetch,
  } = usePurchaseOrder(authToken)

  const {
    data: ordersData,
    status: ordersStatus,
    error: ordersError,
    isStale: ordersIsStale,
    refetch: ordersRefetch,
  } = useCustomerOrders(authToken)

  const [comp, setComp] = React.useState('Products')

  function renderComp() {
    if (comp === 'Products') {
      if (productsStatus === 'loading') {
        return <Skeleton variant="rectangular" width="100%" height="100%" />
      } else if (productsStatus === 'success') {
        return <ProductsTable products={productsData} loading={loading} />
      }
    } else if (comp === 'Stock') {
      if (stockStatus === 'loading') {
        return <Skeleton variant="rectangular" width="100%" height="100%" />
      } else if (stockIsStale) {
        return <StockTable stock={stockData} stockLoading={stockLoading} />
      } else {
        return <StockTable stock={stockData} stockLoading={stockLoading} />
      }
    } else if (comp === 'Orders') {
      return <OrdersTable ordersData={ordersData} authToken={authToken} />
    } else if (comp === 'Suppliers') {
      return <SuppliersTable suppliers={suppliersData} />
    } else if (comp === 'Purchases') {
      return (
        <PurchasesTable
          purchaseOrdersData={purchaseOrdersData}
          handlePurchaseSelection={handlePurchaseSelection}
          authToken={authToken}
        />
      )
    } else if (comp === 'Customers') {
      if (customersStatus === 'loading') {
        return 'Loading...'
      } else {
        return <CustomersTable customers={customersData} />
      }
    }
  }

  React.useEffect(() => {
    if (authToken) {
      suppliersRefetch()
      purchaseOrdersRefetch()
      ordersRefetch()
      customersRefetch()
      productsRefetch()
      stockRefetch()
    }
  }, [authToken])

  React.useEffect(() => {
    if (suppliersIsStale) {
      suppliersRefetch()
    }
  }, [suppliersIsStale])

  React.useEffect(() => {
    if (customersIsStale) {
      customersRefetch()
    }
  }, [customersIsStale])

  React.useEffect(() => {
    if (productsIsStale) {
      productsRefetch()
    }
  }, [productsIsStale])

  React.useEffect(() => {
    if (ordersIsStale) {
      ordersRefetch()
    }
  }, [ordersIsStale])

  React.useEffect(() => {
    console.log('productsData', productsData)
  }, [productsData])

  React.useEffect(() => {
    if (purchaseOrdersIsStale) {
      purchaseOrdersRefetch()
    }
  }, [purchaseOrdersIsStale])

  React.useEffect(() => {
    console.log('products status', productsStatus)
    if (productsStatus === 'loading') {
      setLoading(true)
    } else if (productsStatus === 'success') {
      setLoading(false)
    }
  }, [productsStatus])

  React.useEffect(() => {
    if (stockStatus === 'loading') {
      setStockLoading(true)
    } else if (stockStatus === 'success') {
      setStockLoading(false)
    }
  }, [stockStatus])

  React.useEffect(() => {
    console.log('customersData', customersData)
  }, [customersData])

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  React.useEffect(() => {
    if (comp !== 'Purchases') {
      setPurchaseOrder({ id: null, data: null })
    }
  }, [comp])

  React.useEffect(() => {
    stockRefetch()
    productsRefetch()
    customersRefetch()
    suppliersRefetch()
    purchaseOrdersRefetch()
    ordersRefetch()
  }, [])

  return (
    <div style={{ minHeight: '100%', marginTop: '20px' }}>
      <Grid
        container
        spacing={0}
        gap={3}
        sx={{
          width: '90%',
          margin: '0 auto',
          height: '100%',
        }}
      >
        <Grid item xs={1.5}>
          <NestedList comp={comp} setComp={setComp} />
        </Grid>
        <Grid item xs={9}>
          <Item sx={{ ml: 1 }}>{renderComp()}</Item>
        </Grid>
      </Grid>
    </div>
  )
})
