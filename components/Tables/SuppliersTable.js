import * as React from 'react'

// Material UI
import { DataGrid, GridToolbar, trTR } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'

// Hooks
import useRenderCount from '../../hooks/useRenderCount'
import {
  deleteSupplier,
  useSuppliersByMerchant,
} from '../../hooks/useSuppliersHook'

// Context
import useAuthContext from '../../hooks/useAuthContext'

// React Query
import { useMutation } from '@tanstack/react-query'

// Components
import EditSupplierForm from '../forms/suppliers/EditSupplierForm'

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
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    hide: false,
    editable: false,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'name',
    headerName: 'Supplier Name',
    width: 150,
    hide: false,
    editable: false,
    sortable: true,
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
    renderCell: (params) => <EditBtn params={params} />,
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
    renderCell: (params) => <DeleteBtn params={params} />,
    align: 'right',
    headerAlign: 'center',
    width: 90,
  },
]

const MatDel = ({ index }) => {
  const { state: authState, dispatch: authDispatch } = useAuthContext()

  const { refetch: stockRefetch, isStale: stockIsStale } =
    useSuppliersByMerchant(authState.authToken, index)

  const { mutate } = useMutation(
    () => deleteSupplier(authState.authToken, index),
    {
      onSuccess: () => {
        if (stockIsStale) {
          stockRefetch()
        }
      },
    }
  )

  const handleDelete = () => mutate(index)

  return (
    <FormControlLabel
      control={
        <IconButton
          aria-label="add an alarm"
          onClick={handleDelete}
          data-testid={index}
          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        >
          <DeleteIcon color={'error'} />
        </IconButton>
      }
    />
  )
}

const DeleteBtn = ({ params }) => {
  // useRenderCount('DeleteBtn ST')

  return (
    <div style={{ cursor: 'pointer' }}>
      <MatDel index={params.row.id} />
    </div>
  )
}

const MatEdit = ({ index }) => {
  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
          // onClick={() => handleOpen(index)}
        >
          <EditIcon color={'info'} fontSize={'12px'} />
        </IconButton>
      }
    />
  )
}

const EditBtn = ({ params }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <MatEdit index={params.row.id} />
    </div>
  )
}

export default function SuppliersTable({ suppliers }) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const { authToken } = authState

  const [s, setS] = React.useState(null)

  const {
    data: suppliersData,
    status: suppliersStatus,
    error: suppliersError,
    isStale: suppliersIsStale,
    refetch: suppliersRefetch,
  } = useSuppliersByMerchant(authToken)

  React.useEffect(() => {
    if (suppliersData) {
      setS(suppliersData)
    }
  }, [suppliersData])

  // React.useEffect(() => {
  //   if (suppliersIsStale) {
  //     suppliersRefetch()
  //   }
  // }, [suppliersIsStale])

  // React.useEffect(() => {
  //   if (authToken) {
  //     suppliersRefetch()
  //   }
  // }, [authToken])

  const [open, setOpen] = React.useState(false)
  const [idx, setIdx] = React.useState(null)

  const [supplierToEdit, setSupplierToEdit] = React.useState({
    id: '',
    name: '',
  })

  const handleOpen = (params) => {
    setIdx(params.id)
    setSupplierToEdit({
      id: params.id,
      name: params.row.name,
    })
    setOpen(true)
  }

  const { mutate } = useMutation((i) => deleteSupplier(authToken, i), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`suppliersByMerchant`] })
    },
  })

  const handleDelete = (i) => mutate(i)

  const handleClose = () => {
    setOpen(false)
    setIdx(null)
  }

  React.useEffect(() => {
    console.log('idx', idx)
    // console.log('suppliers', suppliers)
  }, [/*suppliers,*/ idx])

  React.useEffect(() => {
    console.log('s', s)
  }, [s])

  React.useEffect(() => {
    if (suppliersData) {
      console.log('suppliersData', suppliersData)
    }
  }, [suppliersData])

  const [status, setStatus] = React.useState(false)
  React.useEffect(() => {
    if (suppliersStatus === 'loading') {
      setStatus(true)
    } else if (suppliersStatus === 'success') {
      setStatus(false)
    }
  }, [suppliersStatus])

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        // rows={s !== null ? s : []}
        // rows={suppliers}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        rows={suppliersData !== undefined ? suppliersData.suppliers : []}
        columns={columns}
        pageSize={5}
        // disableColumnFilter
        disableDensitySelector
        density="comfortable"
        filterMode="client"
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress,
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
        rowsPerPageOptions={[5]}
        rowHeight={42}
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          if (params.field === 'edit') {
            handleOpen(params)
          } else if (params.field === 'delete') {
            handleDelete(params.id)
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
            <EditSupplierForm
              supplierToEdit={supplierToEdit}
              setSupplierToEdit={setSupplierToEdit}
              handleClose={handleClose}
              authToken={authToken}
              idx={idx}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
