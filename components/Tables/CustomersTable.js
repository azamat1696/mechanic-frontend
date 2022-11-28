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

// React Query
import { useMutation } from '@tanstack/react-query'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const MatDel = ({ index }) => {
  const { state: authState } = useAuthContext()
  const { refetch: customersRefetch, isStale: customersIsStale } =
    useCustomersByMerchant(authState.authToken, 'customersByMerchant')

  const { mutate } = useMutation(
    () => deleteCustomer(authState.authToken, index),
    {
      onSuccess: () => {
        if (customersIsStale) {
          customersRefetch()
        }
      },
    }
  )

  const handleDelete = (index) => mutate(index)

  return (
    <FormControlLabel
      control={
        <IconButton
          aria-label="add an alarm"
          onClick={() => handleDelete(index)}
          // data-testid={index}
        >
          <DeleteIcon color={'error'} />
        </IconButton>
      }
    />
  )
}

const MatEdit = ({ index }) => {
  useRenderCount('Mat Edit CT')
  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          // onClick={() => handleOpen(index)}
        >
          <EditIcon color={'info'} fontSize={'12px'} />
        </IconButton>
      }
    />
  )
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
    renderCell: (params) => <DeleteBtn params={params} />,
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
    renderCell: (params) => <EditBtn params={params} />,
    align: 'right',
    headerAlign: 'center',
    width: 100,
  },
]

const EditBtn = ({ params }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <MatEdit index={params.row.id} />
    </div>
  )
}

const DeleteBtn = ({ params }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <MatDel index={params.row.id} />
    </div>
  )
}

export default React.memo(function CustomersTable({ customers, authToken }) {
  useRenderCount('CustomersTable')

  const [open, setOpen] = React.useState(false)
  const [idx, setIdx] = React.useState(null)

  const [customerToEdit, setCustomerToEdit] = React.useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
  })

  const handleOpen = (i) => {
    setIdx(i)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setIdx(null)
  }

  React.useEffect(() => {
    console.log('customer', customers)
  }, [customers])

  React.useEffect(() => {
    const found = customers.find((item) => item.id === idx)
    if (found) {
      setCustomerToEdit({
        id: found.id,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        telephone: found.telephone,
      })
    } else {
      setCustomerToEdit({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
      })
    }
  }, [idx, customers])

  React.useEffect(() => {
    console.log('customerToEdit', customerToEdit)
  }, [customerToEdit])

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
        onCellClick={(params) =>
          params.field === 'edit' && handleOpen(params.id)
        }
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
              customerToEdit={customerToEdit}
              setCustomerToEdit={setCustomerToEdit}
              handleClose={handleClose}
              authToken={authToken}
              idx={idx}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
})
