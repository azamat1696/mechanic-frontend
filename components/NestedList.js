import * as React from 'react'
import dynamic from 'next/dynamic'
// MUI
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// MUI Icons
import AddIcon from '@mui/icons-material/Add'

// Components
// import Modals from '../components/Modals'

const fallback = () => 'Loading ...'
const Modals = dynamic(() => import('../components/Modals'), {
  loading: fallback,
})

const listStyle = {
  width: '100%',
  fontWeight: 600,
  p: 0,
  backgroundColor: '#fff',
  boxShadow:
    'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
}

const btnStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

const fontStyle = {
  fontFamily: "'Karla', sans-serif;",
  fontWeight: 500,
}

export default function NestedList({ comp, setComp }) {
  const [openOrders, setOpenOrders] = React.useState(false)
  const [openPurchases, setOpenPurchases] = React.useState(false)
  const [openProducts, setOpenProducts] = React.useState(false)
  const [openCustomers, setOpenCustomers] = React.useState(false)
  const [openSuppliers, setOpenSuppliers] = React.useState(false)

  const handleClick = (num, e) => {
    // Orders
    if (num === 1) {
      setOpenOrders(!openOrders)
      setOpenPurchases(false)
      setOpenProducts(false)
      setOpenCustomers(false)
      setOpenSuppliers(false)
      setComp('Orders')
    }

    // Purchases
    if (num === 2) {
      setOpenPurchases(!openPurchases)
      setOpenOrders(false)
      setOpenProducts(false)
      setOpenCustomers(false)
      setOpenSuppliers(false)
      setComp('Purchases')
    }

    // Products
    if (num === 3) {
      setOpenProducts(!openProducts)
      setOpenPurchases(false)
      setOpenOrders(false)
      setOpenCustomers(false)
      setOpenSuppliers(false)
      setComp('Products')
    }

    // Stock
    if (num === 4) {
      setComp('Stock')
      setOpenPurchases(false)
      setOpenOrders(false)
      setOpenProducts(false)
      setOpenCustomers(false)
      setOpenSuppliers(false)
    }

    // Customers
    if (num === 5) {
      setOpenCustomers(!openCustomers)
      setOpenPurchases(false)
      setOpenOrders(false)
      setOpenProducts(false)
      setOpenSuppliers(false)
      setComp('Customers')
    }

    // Suppliers
    if (num === 6) {
      setOpenSuppliers(!openSuppliers)
      setOpenPurchases(false)
      setOpenOrders(false)
      setOpenProducts(false)
      setOpenCustomers(false)
      setComp('Suppliers')
    }
  }

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box>
      <List
        sx={listStyle}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {/* Products */}
        <ListItemButton
          onClick={(e) => handleClick(3, e)}
          disableRipple={true}
          sx={btnStyle}
        >
          <Typography variant="subtitle1" sx={fontStyle}>
            Products
          </Typography>
          {openProducts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider />
            <ListItemButton
              disableRipple={true}
              onClick={handleOpen}
              sx={{ pl: 6, ...btnStyle, backgroundColor: '#f3f3f39e' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ ...fontStyle, fontSize: '1.03rem', fontWeight: 400 }}
              >
                Create
              </Typography>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#65686c' }} />
              </ListItemIcon>
            </ListItemButton>
            <Divider />
          </List>
        </Collapse>
        {/* Products */}

        {/* Stock */}
        <ListItemButton
          disableRipple={true}
          onClick={(e) => handleClick(4, e)}
          sx={btnStyle}
        >
          {/* <ListItemText primary="Stock" /> */}
          <Typography variant="subtitle1" sx={fontStyle}>
            Stock
          </Typography>
        </ListItemButton>
        {/* Stock */}

        {/* Orders */}
        <ListItemButton
          onClick={(e) => handleClick(1, e)}
          disableRipple={true}
          sx={btnStyle}
        >
          <Typography variant="subtitle1" sx={fontStyle}>
            Orders
          </Typography>
          {openOrders ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openOrders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider />
            <ListItemButton
              disableRipple={true}
              onClick={handleOpen}
              sx={{ pl: 6, ...btnStyle, backgroundColor: '#f3f3f39e' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ ...fontStyle, fontSize: '1.03rem', fontWeight: 400 }}
              >
                Create
              </Typography>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#65686c' }} />
              </ListItemIcon>
            </ListItemButton>
            <Divider />
          </List>
        </Collapse>
        {/* Orders */}

        {/* Purchases */}
        <ListItemButton
          onClick={(e) => handleClick(2, e)}
          disableRipple={true}
          sx={btnStyle}
        >
          <Typography variant="subtitle1" sx={fontStyle}>
            Purchases
          </Typography>
          {openPurchases ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openPurchases} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider />
            <ListItemButton
              disableRipple={true}
              onClick={handleOpen}
              sx={{ pl: 6, ...btnStyle, backgroundColor: '#f3f3f39e' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ ...fontStyle, fontSize: '1.03rem', fontWeight: 400 }}
              >
                Create
              </Typography>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#65686c' }} />
              </ListItemIcon>
            </ListItemButton>
            <Divider />
          </List>
        </Collapse>
        {/* Purchases */}

        {/* Customers */}
        <ListItemButton
          disableRipple={true}
          onClick={(e) => handleClick(5, e)}
          sx={btnStyle}
        >
          <Typography variant="subtitle1" sx={fontStyle}>
            Customers
          </Typography>
          {openCustomers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openCustomers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider />
            <ListItemButton
              disableRipple={true}
              onClick={handleOpen}
              sx={{ pl: 6, ...btnStyle, backgroundColor: '#f3f3f39e' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ ...fontStyle, fontSize: '1.03rem', fontWeight: 400 }}
              >
                Create
              </Typography>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#65686c' }} />
              </ListItemIcon>
            </ListItemButton>
            <Divider />
          </List>
        </Collapse>
        {/* Customers */}

        {/* Suppliers */}
        <ListItemButton
          disableRipple={true}
          onClick={(e) => handleClick(6, e)}
          sx={btnStyle}
        >
          <Typography variant="subtitle1" sx={fontStyle}>
            Suppliers
          </Typography>
          {openSuppliers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openSuppliers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider />
            <ListItemButton
              disableRipple={true}
              onClick={handleOpen}
              sx={{ pl: 6, ...btnStyle, backgroundColor: '#f3f3f39e' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ ...fontStyle, fontSize: '1.03rem', fontWeight: 400 }}
              >
                Create
              </Typography>

              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AddIcon sx={{ color: '#65686c' }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Collapse>
        {/* Suppliers */}
      </List>
      <Modals comp={comp} setOpen={setOpen} open={open} />
    </Box>
  )
}
