import React from 'react'
import dynamic from 'next/dynamic'

// Material UI
import Box from '@mui/material/Box'

// Modal
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

// Components
// import CreateProductForm from '../components/forms/products/CreateProductForm'
// import CreateCustomerForm from './forms/customers/CreateCustomerForm'
// import CreateSupplierForm from './forms/suppliers/CreateSupplierForm'
// import PurchaseForm from './forms/purchases/PurchaseForm'
// import CreateJobForm from './forms/orders/CreateOrderForm'
// import PurchaseForm2 from './forms/purchases/PurchaseForm2'
// import OrderForm from './forms/orders/OrderForm'
const fallback = () => 'Loading ...'

const CreateProductForm = dynamic(
  () => import('../components/forms/products/CreateProductForm'),
  {
    loading: fallback,
  }
)
const CreateCustomerForm = dynamic(
  () => import('./forms/customers/CreateCustomerForm'),
  {
    loading: fallback,
  }
)
const CreateSupplierForm = dynamic(
  () => import('./forms/suppliers/CreateSupplierForm'),
  {
    loading: fallback,
  }
)
const PurchaseForm2 = dynamic(() => import('./forms/purchases/PurchaseForm2'), {
  loading: fallback,
})
const OrderForm = dynamic(() => import('./forms/orders/OrderForm'), {
  loading: fallback,
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function Modals({ comp, setOpen, open }) {
  const handleClose = () => setOpen(false)

  return (
    <Box sx={{ width: '100%' }}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {comp === 'Products' && (
              <CreateProductForm handleClose={handleClose} />
            )}

            {comp === 'Customers' && (
              <CreateCustomerForm handleClose={handleClose} />
            )}

            {comp === 'Suppliers' && (
              <CreateSupplierForm handleClose={handleClose} />
            )}

            {/* {comp === 'Purchases' && <PurchaseForm handleClose={handleClose} />} */}
            {comp === 'Purchases' && (
              <PurchaseForm2 handleClose={handleClose} />
            )}

            {/* {comp === 'Orders' && <CreateJobForm handleClose={handleClose} />} */}
            {comp === 'Orders' && <OrderForm handleClose={handleClose} />}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
