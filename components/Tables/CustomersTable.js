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
import LinearProgress from '@mui/material/LinearProgress'

// Components
import EditCustomerForm from '../forms/customers/EditCustomerForm'

// Context
import useAuthContext from '../../hooks/useAuthContext'

// Hooks
import { deleteCustomer } from '../../hooks/useAsyncHooks'
import { useCustomersByMerchant } from '../../hooks/useAsyncHooks'

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
    width: 80,
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
    width: 110,
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
    width: 110,
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
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <DeleteBtn />,
    align: 'right',
    headerAlign: 'center',
    width: 90,
  },
]

const EditBtn = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <FormControlLabel
        control={
          <IconButton
            color="secondary"
            aria-label="add an alarm"
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
          >
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

export default React.memo(function CustomersTable() {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const { data: customersData, status: customersStatus } =
    useCustomersByMerchant(authToken)

  const [status, setStatus] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const [customer, setCustomer] = React.useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleDelete = (i) => mutate(i)

  const { mutate } = useMutation((i) => deleteCustomer(authToken, i), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`customersByMerchant`] })
      queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
    },
  })

  React.useEffect(() => {
    if (customersStatus === 'loading') {
      setStatus(true)
    } else if (customersStatus === 'success') {
      setStatus(false)
    }
  }, [customersStatus])

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        components={{ Toolbar: GridToolbar, LoadingOverlay: LinearProgress }}
        // disableColumnFilter
        disableDensitySelector
        density="comfortable"
        filterMode="client"
        rows={customersData !== undefined ? customersData.customers : []}
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
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rowHeight={42}
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
        loading={status}
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
