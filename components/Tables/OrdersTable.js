import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

// Components
import EditOrderForm from '../forms/orders/EditOrderForm'

// Material UI
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'

import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

// Hooks
import {
  deleteCustomerOrder,
  useCustomerOrders,
} from '../../hooks/useOrdersHook'
import { useStockByMerchantData } from '../../hooks/useAsyncHooks'
import useAuthContext from '../../hooks/useAuthContext'

// React Query
import { useMutation } from '@tanstack/react-query'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  minHeight: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
}

const columns = [
  {
    field: 'id',
    headerName: 'Job Number',
    width: 150,
    hide: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'supplier',
    headerName: 'Customer Name',
    width: 150,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      return `${params.row.user.firstName} ${params.row.user.lastName} `
    },
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 150,
    editable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 100,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      const order = params.row.orderDetail
      const ttl = order.reduce((acc, obj) => {
        return acc + obj['quantity']
      }, 0)
      return ttl
    },
  },
  {
    field: 'ttlRetail',
    headerName: 'Total Retail',
    type: 'number',
    width: 140,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      const order = params.row.orderDetail
      const ttlsArr = order.map((o) => o.quantity * o.price)
      let totalOrderRtl

      ttlsArr > 0
        ? (totalOrderRtl = ttlsArr.reduce((acc, cv) => acc + cv))
        : (totalOrderRtl = 0)

      const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      })

      return formatter.format(totalOrderRtl)
    },
  },
  {
    field: 'deliveryStatus',
    headerName: 'Status',
    sortable: false,
    width: 140,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <StatusChip params={params} />,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    headerAlign: 'center',
    align: 'right',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <DeleteBtn />,
    width: 120,
  },
  {
    field: 'edit',
    headerName: 'Edit',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <EditBtn />,
    align: 'right',
    headerAlign: 'center',
    width: 90,
  },
]

const MatDel = ({ index }) => {
  return (
    <FormControlLabel
      control={
        <IconButton
          aria-label="add an alarm"
          // onClick={handleDelete}
          data-testid={index}
        >
          <DeleteIcon color={'error'} />
        </IconButton>
      }
    />
  )
}

const DeleteBtn = ({ params }) => {
  return (
    <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
      Delete
    </Button>
  )
}

const StatusChip = ({ params }) => {
  const { status } = params.row
  if (status === 'Waiting') {
    return <Chip label="Waiting" color="error" variant="outlined" />
  } else if (status === 'In Progress') {
    return <Chip label="In Progress" color="primary" variant="outlined" />
  } else if (status === 'Complete') {
    return <Chip label="Complete" color="success" variant="outlined" />
  }
}

const EditBtn = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <FormControlLabel
        control={
          <IconButton
            color="secondary"
            aria-label="add an alarm"
            disableRipple={true}
          >
            <EditIcon color={'info'} fontSize={'12px'} />
          </IconButton>
        }
      />
    </div>
  )
}

export default function OrdersTable({ ordersData }) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [order, setOrder] = React.useState(null)

  const { refetch: ordersRefetch } = useCustomerOrders(authToken)
  const { refetch: stockRefetch } = useStockByMerchantData(authToken, id)

  const { mutate } = useMutation((i) => deleteCustomerOrder(authToken, i), {
    onSuccess: () => {
      ordersRefetch()
      stockRefetch()
    },
  })

  const handleDelete = (i) => mutate(i)

  const handleEdit = (i, params) => {
    console.log('edit clicked', i)
    handleOpen()
    setOrder(params.row)
  }

  React.useEffect(() => {
    if (authToken) {
      ordersRefetch()
    }
  }, [authToken])

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <DataGrid
        rows={ordersData.foundOrders}
        columns={columns}
        pageSize={5}
        density="comfortable"
        disableColumnFilter
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          panel: {
            sx: {
              '& .MuiTypography-root': {
                color: '#2e2e2e',
                fontSize: 15,
              },
              '& .MuiDataGrid-filterForm': {
                backgroundColor: 'red',
              },
            },
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            padding: '15px 40px 0px 40px',
          },
          '& .MuiButton-root': {
            color: '#4777a9',
            marginRight: '20px',
            '&:hover': {
              backgroundColor: '#fff',
            },
          },
          '& .MuiInputBase-root-MuiInput-root': {
            color: 'red',
          },
          '.MuiDataGrid-cell:focus': {
            outline: 'none !important',
          },
        }}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          const { id } = params
          console.log('Params', params.row)
          if (params.field === 'edit') {
            handleEdit(id, params)
          }
          if (params.field === 'delete') {
            handleDelete(id)
          }
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 3000,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditOrderForm order={order} open={open} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
