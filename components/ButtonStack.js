// import * as React from 'react'
// import Stack from '@mui/material/Stack'
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'

// // Components
// import CreateProductForm from '../components/forms/products/CreateProductForm'
// import CreateCustomerForm from './forms/customers/CreateCustomerForm'
// import CreateSupplierForm from './forms/suppliers/CreateSupplierForm'
// import PurchaseForm from './forms/purchases/PurchaseForm'
// import CreateJobForm from './forms/orders/CreateOrderForm'

// // Icons
// import AddIcon from '@mui/icons-material/Add'

// // Modal
// import Backdrop from '@mui/material/Backdrop'
// import Modal from '@mui/material/Modal'
// import Fade from '@mui/material/Fade'

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 750,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// }

// const ProductButton = ({ handleOpen }) => {
//   return (
//     <Button
//       endIcon={<AddIcon />}
//       onClick={handleOpen}
//       variant="contained"
//       sx={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#3c5f83',
//         '&:hover': { backgroundColor: '#3c5f83' },
//       }}
//       disableRipple={true}
//     >
//       Create
//     </Button>
//   )
// }

// const CustomerButton = ({ handleOpen }) => {
//   return (
//     <Button
//       endIcon={<AddIcon />}
//       onClick={handleOpen}
//       variant="contained"
//       sx={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#3c5f83',
//         '&:hover': { backgroundColor: '#3c5f83' },
//       }}
//       disableRipple={true}
//     >
//       Create
//     </Button>
//   )
// }

// const SupplierButton = ({ handleOpen }) => {
//   return (
//     <Button
//       endIcon={<AddIcon />}
//       onClick={handleOpen}
//       variant="contained"
//       sx={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#3c5f83',
//         '&:hover': { backgroundColor: '#3c5f83' },
//       }}
//       disableRipple={true}
//     >
//       Supplier
//     </Button>
//   )
// }

// const PurchaseButton = ({ handleOpen }) => {
//   return (
//     <Button
//       endIcon={<AddIcon />}
//       onClick={handleOpen}
//       variant="contained"
//       sx={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#3c5f83',
//         '&:hover': { backgroundColor: '#3c5f83' },
//       }}
//       disableRipple={true}
//     >
//       Purchase
//     </Button>
//   )
// }

// const OrderButton = ({ handleOpen }) => {
//   return (
//     <Button
//       endIcon={<AddIcon />}
//       onClick={handleOpen}
//       variant="contained"
//       sx={{
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#3c5f83',
//         '&:hover': { backgroundColor: '#3c5f83' },
//       }}
//       disableRipple={true}
//     >
//       Order
//     </Button>
//   )
// }

// export default function DividerStack({ comp, setOpen: setO }) {
//   const [open, setOpen] = React.useState(false)
//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)

//   return (
//     <Box sx={{ width: '100%', mt: 2 }}>
//       <Stack spacing={0} gap={1}>
//         {comp === 'Customers' && <CustomerButton handleOpen={handleOpen} />}
//         {comp === 'Products' && <ProductButton handleOpen={handleOpen} />}
//         {comp === 'Purchases' && <PurchaseButton handleOpen={handleOpen} />}
//         {comp === 'Suppliers' && <SupplierButton handleOpen={handleOpen} />}
//         {comp === 'Orders' && <OrderButton handleOpen={handleOpen} />}
//         <Modal
//           aria-labelledby="transition-modal-title"
//           aria-describedby="transition-modal-description"
//           open={open}
//           onClose={handleClose}
//           closeAfterTransition
//           BackdropComponent={Backdrop}
//           BackdropProps={{
//             timeout: 500,
//           }}
//         >
//           <Fade in={open}>
//             <Box sx={style}>
//               {comp === 'Products' && (
//                 <CreateProductForm handleClose={handleClose} />
//               )}
//               {comp === 'Customers' && (
//                 <CreateCustomerForm handleClose={handleClose} />
//               )}
//               {comp === 'Suppliers' && (
//                 <CreateSupplierForm handleClose={handleClose} />
//               )}
//               {comp === 'Purchases' && (
//                 <PurchaseForm handleClose={handleClose} setO={setO} />
//               )}
//               {comp === 'Orders' && (
//                 <CreateJobForm handleClose={handleClose} setO={setO} />
//               )}
//             </Box>
//           </Fade>
//         </Modal>
//       </Stack>
//     </Box>
//   )
// }
