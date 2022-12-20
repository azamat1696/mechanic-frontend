import * as React from 'react'

// Material UI
import { DataGrid } from '@mui/x-data-grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { GridToolbar } from '@mui/x-data-grid'

// Components
import EditCustomerForm from '../forms/customers/EditCustomerForm'

// Context
import useAuthContext from '../../hooks/useAuthContext'

// Hooks
import {
  deleteCustomer,
  useCustomersByMerchant,
} from '../../hooks/useAsyncHooks'
import useRenderCount from '../../hooks/useRenderCount'
import { useStockByMerchantData } from '../../hooks/useAsyncHooks'
// React Query
import { useMutation } from '@tanstack/react-query'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
}

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    hide: false,
    editable: false,
    sortable: false,
    filterable: false,
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    hide: false,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    hide: false,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'email',
    headerName: 'E-Mail',
    width: 150,
    hide: false,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'telephone',
    headerName: 'Telephone',
    width: 150,
    hide: false,
    editable: false,
    sortable: false,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'delete',
    headerName: 'Delete',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <DeleteBtn />,
    align: 'right',
    headerAlign: 'center',
    width: 100,
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
    width: 100,
  },
]

const EditBtn = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <FormControlLabel
        control={
          <IconButton color="secondary" aria-label="add an alarm">
            <EditIcon color={'info'} fontSize={'12px'} />
          </IconButton>
        }
      />
    </div>
  )
}

const DeleteBtn = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <FormControlLabel
        control={
          <IconButton aria-label="add an alarm">
            <DeleteIcon color={'error'} />
          </IconButton>
        }
      />
    </div>
  )
}

export default React.memo(function CustomersTable({ customers }) {
  const { state: authState } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const [open, setOpen] = React.useState(false)

  const [customer, setCustomer] = React.useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleDelete = (i) => mutate(i)

  const { refetch: customersRefetch } = useCustomersByMerchant(authToken)
  const { refetch: stockRefetch } = useStockByMerchantData(authToken, id)

  const { mutate } = useMutation((i) => deleteCustomer(authToken, i), {
    onSuccess: () => {
      customersRefetch()
      stockRefetch()
    },
  })

  return (
    <Box sx={{ height: '500px' }}>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        // disableColumnFilter
        disableDensitySelector
        density="comfortable"
        filterMode="client"
        componentsProps={{
          panel: {
            sx: {
              '& .MuiTypography-root': {
                color: '#2e2e2e',
                fontSize: 15,
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
        }}
        rows={customers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableVirtualization={true}
        onCellClick={(params) => {
          const { id } = params.row
          setCustomer(params.row)
          if (params.field === 'edit') {
            handleOpen()
          }
          if (params.field === 'delete') {
            handleDelete(params.row.id)
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
          timeout: 400,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditCustomerForm
              customer={customer}
              setCustomer={setCustomer}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
})
