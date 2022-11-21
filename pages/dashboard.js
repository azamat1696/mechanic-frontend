import React from 'react'
import { useRouter } from 'next/router'

// Components
import StockTable from '../components/Tables/StockTable'
import ProductsTable from '../components/Tables/ProductsTable'
import CustomersTable from '../components/Tables/CustomersTable'
import SideNavDashboard from '../components/SideNavDashboard'
import PurchasesTable from '../components/Tables/PurchasesTable'
import SuppliersTable from '../components/Tables/SuppliersTable'
import OrdersTable from '../components/Tables/OrdersTable'

// Hooks
import useAuthContext from '../hooks/useAuthContext'
import {
  useStockByMerchantData,
  useProductsByMerchantData,
  useCustomersByMerchant,
} from '../hooks/useAsyncHooks'
import { useSuppliersByMerchant } from '../hooks/useSuppliersHook'
import { usePurchaseOrder } from '../hooks/usePurchaseOrderHook'
import { useOrders } from '../hooks/useOrdersHook'

// Material UI
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import ButtonStack from '../components/ButtonStack'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default React.memo(function Dashboard() {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const [loading, setLoading] = React.useState(false)
  const [stockLoading, setStockLoading] = React.useState(false)
  const router = useRouter()

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
  } = useStockByMerchantData(authToken, id, 'stockByMerchant')

  const {
    data: productsData,
    status: productsStatus,
    error: productError,
    isStale: productsIsStale,
  } = useProductsByMerchantData(authToken, 'productsByMerchant')

  const {
    data: customersData,
    status: customersStatus,
    error: customersError,
    isStale: customersIsStale,
    refetch: customersRefetch,
  } = useCustomersByMerchant(authToken, 'customersByMerchant')

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
  } = useOrders(authToken)

  const [comp, setComp] = React.useState('Products')

  React.useEffect(() => {
    if (customersIsStale) {
      customersRefetch()
    }
  }, [customersIsStale])

  React.useEffect(() => {
    if (purchaseOrdersIsStale) {
      purchaseOrdersRefetch()
    }
  }, [purchaseOrdersIsStale])

  React.useEffect(() => {
    console.log('ps products status', productsStatus)
    if (productsStatus === 'loading') {
      setLoading(true)
    } else if (productsStatus === 'success') {
      setLoading(false)
    }
  }, [productsStatus])

  React.useEffect(() => {
    console.log('ps stockStatus', stockStatus)
    if (stockStatus === 'loading') {
      setStockLoading(true)
    } else if (stockStatus === 'success') {
      setStockLoading(false)
    }
  }, [stockStatus])

  function renderComp() {
    if (comp === 'Products') {
      if (productsStatus === 'loading') {
        return 'Loading...'
      } else if (productsStatus === 'success') {
        return (
          <ProductsTable
            products={productsData}
            loading={loading}
            // setLoading={setLoading}
          />
        )
      }
    } else if (comp === 'Stock') {
      if (stockStatus === 'loading') {
        return '...Loading'
      } else if (stockIsStale) {
        return <StockTable stock={stockData} stockLoading={stockLoading} />
      }
    } else if (comp === 'Jobs') {
      return <OrdersTable ordersData={ordersData} authToken={authToken} />
    } else if (comp === 'Suppliers') {
      return <SuppliersTable suppliers={suppliersData} authToken={authToken} />
    } else if (comp === 'Purchases') {
      return (
        <PurchasesTable
          purchaseOrdersData={purchaseOrdersData}
          authToken={authToken}
        />
      )
    } else if (comp === 'Customers') {
      if (customersStatus === 'loading') {
        return 'Loading...'
      } else if (customersIsStale) {
        return (
          <CustomersTable customers={customersData} authToken={authToken} />
        )
      }
    }
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div>
      <Grid
        container
        spacing={2.5}
        sx={{ mt: 2, width: '90%', margin: '0 auto' }}
      >
        <Grid item xs={1.55}>
          <Item>
            <SideNavDashboard comp={comp} setComp={setComp} />
          </Item>
          <ButtonStack comp={comp} />
        </Grid>
        <Grid item xs={10}>
          <Item sx={{ ml: 1 }}>{renderComp()}</Item>
        </Grid>
      </Grid>
    </div>
  )
})
