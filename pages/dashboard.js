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

// Material UI
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

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
  }, [isAuthenticated, router])

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
