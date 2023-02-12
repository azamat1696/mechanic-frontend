import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

// Components
import ProductsTable from '../components/Tables/ProductsTable'
import NestedList from '../components/NestedList'
import { SettingsButton } from '../components/Settings'

// Hooks
import useAuthContext from '../hooks/useAuthContext'

// Material UI
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

const StockTable = dynamic(() => import('../components/Tables/StockTable'), {
  loading: () => (
    <Skeleton variant="rectangular" sx={skeletonStyles} animation="wave" />
  ),
})

const CustomersTable = dynamic(
  () => import('../components/Tables/CustomersTable'),
  {
    loading: () => (
      <Skeleton variant="rectangular" sx={skeletonStyles} animation="wave" />
    ),
  }
)

const PurchasesTable = dynamic(
  () => import('../components/Tables/PurchasesTable'),
  {
    loading: () => (
      <Skeleton variant="rectangular" sx={skeletonStyles} animation="wave" />
    ),
  }
)

const SuppliersTable = dynamic(
  () => import('../components/Tables/SuppliersTable'),
  {
    loading: () => (
      <Skeleton variant="rectangular" sx={skeletonStyles} animation="wave" />
    ),
  }
)

const skeletonStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

const OrdersTable = dynamic(() => import('../components/Tables/OrdersTable'), {
  loading: () => (
    <Skeleton variant="rectangular" sx={skeletonStyles} animation="wave" />
  ),
})

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default React.memo(function Dashboard() {
  const router = useRouter()

  const { state: authState } = useAuthContext()
  const { isAuthenticated } = authState

  const [comp, setComp] = React.useState('Products')

  function renderComp() {
    if (comp === 'Products') {
      return <ProductsTable />
    } else if (comp === 'Stock') {
      return <StockTable />
    } else if (comp === 'Orders') {
      return <OrdersTable />
    } else if (comp === 'Suppliers') {
      return <SuppliersTable />
    } else if (comp === 'Purchases') {
      return <PurchasesTable />
    } else if (comp === 'Customers') {
      return <CustomersTable />
    }
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated])

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
          <SettingsButton comp={comp} setComp={setComp} />
          <NestedList comp={comp} setComp={setComp} />
        </Grid>
        <Grid item xs={10} sx={{ position: 'relative', height: 500 }}>
          <Item sx={{ ml: 1 }}>{renderComp()}</Item>
        </Grid>
      </Grid>
    </div>
  )
})
