import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'

import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

import EditPurchaseForm from '../forms/purchases/EditPurchaseForm'

// Hooks
import useAuthContext from '../../hooks/useAuthContext'
import { getPdf } from '../../hooks/usePurchaceOrderPdf'
import {
  deletePurchaseOrder,
  usePurchaseOrder,
} from '../../hooks/usePurchaseOrderHook'

// React Query
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../pages/_app'

const fontStyle = {
  fontFamily: "'Karla', sans-serif;",
  fontWeight: 400,
  fontSize: '0.9rem',
}

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
    headerName: 'ID',
    width: 80,
    hide: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'supplier',
    headerName: 'Supplier',
    width: 150,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      return params.row.supplier.name
    },
  },
  {
    field: 'orderDate',
    headerName: 'Order Date',
    type: 'number',
    width: 150,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      return new Date(params.row.createdAt).toDateString()
    },
  },
  {
    field: 'orderQty',
    headerName: 'Quantity',
    sortable: false,
    width: 110,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      const order = params.row.purchaseDetail
      const ttl = order.reduce((acc, obj) => {
        return acc + obj['quantity']
      }, 0)
      return ttl
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <StatusChip params={params} />,
  },
  // {
  //   field: 'order',
  //   headerName: 'Order',
  //   sortable: false,
  //   width: 110,
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: (params) => <ViewBtn params={params} />,
  // },
  {
    field: 'downloadPdf',
    headerName: 'Download',
    sortable: false,
    width: 95,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <Download params={params} />,
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

  {
    field: 'delete',
    headerName: 'Delete',
    headerAlign: 'center',
    align: 'right',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <DeleteBtn />,
    width: 90,
  },
]

// const DeleteBtn = ({ params }) => {
//   return (
//     <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
//       Delete
//     </Button>
//   )
// }

const DeleteBtn = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <FormControlLabel
        control={
          <IconButton
            aria-label="add an alarm"
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
          >
            <DeleteIcon color={'error'} />
          </IconButton>
        }
      />
    </div>
  )
}

const StatusChip = ({ params }) => {
  const { status } = params.row
  if (status === 'Pending') {
    return <Chip label="Pending" color="primary" variant="outlined" />
  } else if (status === 'Delivered') {
    return <Chip label="Delivered" color="success" variant="outlined" />
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

const Download = ({ params }) => {
  const { state: authState, dispatch } = useAuthContext()
  const { authToken } = authState

  async function handlePdfDownload(name, token, id) {
    const { myFile, err } = await getPdf(token, id)

    if (err) {
      return err
    }

    const f = new File([myFile], `${name}.pdf`, { type: 'application/pdf' })
    const url = URL.createObjectURL(f)

    let link = document.createElement('a')
    link.href = url
    link.download = f.name
    link.target = '__blank'

    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
    link.remove()
  }

  return (
    <IconButton
      aria-label="delete"
      size="large"
      color="primary"
      onClick={() => handlePdfDownload('invoice', authToken, params.row.id)}
      sx={{ '&:hover': { backgroundColor: 'transparent' } }}
    >
      <DownloadIcon fontSize="inherit" />
    </IconButton>
  )
}

export default function PurchasesTable({
  purchaseOrdersData,
  handlePurchaseSelection,
}) {
  const [pageSize, setPageSize] = React.useState(10)

  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const { authToken } = authState

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [purchase, setPurchase] = React.useState(null)

  const handleEdit = (i, params) => {
    console.log('edit clicked', i)
    handleOpen()
    setPurchase(params.row)
  }

  const { mutate } = useMutation((i) => deletePurchaseOrder(authToken, i), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`ordersByMerchant`] })
      queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
    },
  })

  const handleDelete = (i) => mutate(i)

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={purchaseOrdersData.orders}
        columns={columns}
        pageSize={pageSize}
        disableColumnFilter
        density="comfortable"
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            sx: {
              '& .MuiButton-root': {
                color: '#4071bb',
                fontSize: 12,
              },
            },
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
          ...fontStyle,
        }}
        rowsPerPageOptions={[10]}
        rowHeight={40}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          handlePurchaseSelection(params)
          const { id } = params
          console.log('Params', params.row)
          if (params.field === 'delete') {
            handleDelete(id)
          }
          if (params.field === 'edit') {
            handleEdit(id, params)
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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditPurchaseForm
              purchase={purchase}
              open={open}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
