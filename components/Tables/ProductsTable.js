import * as React from 'react'
import Image from 'next/image'

// Material UI
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'

// MUI Icons
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

// Components
import EditProductForm from '../forms/products/EditProductForm'

// Context
import useAuthContext from '../../hooks/useAuthContext'

// Hooks
import {
  deleteProduct,
  useProductsByMerchantData,
  useStockByMerchantData,
} from '../../hooks/useAsyncHooks'
import useRenderCount from '../../hooks/useRenderCount'

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
    field: 'image',
    headerName: 'Image',
    width: 120,
    editable: false,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <Img params={params} />,
  },
  {
    field: 'name',
    headerName: 'Product name',
    width: 130,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'product_code',
    headerName: 'Product code',
    width: 130,
    editable: false,
    sortable: false,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    width: 130,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'supplierName',
    headerName: 'Supplier Name',
    width: 130,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
    filterable: true,
    valueGetter: (params) => {
      return params.row.supplier.name
    },
  },
  {
    field: 'costPrice',
    headerName: 'Cost',
    width: 100,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
    filterable: true,
    valueGetter: (params) => {
      const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      })
      return formatter.format(params.row.costPrice)
    },
  },
  {
    field: 'retailPrice',
    headerName: 'Retail',
    width: 100,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
    filterable: true,
    valueGetter: (params) => {
      const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      })
      return formatter.format(params.row.retailPrice)
    },
  },
  {
    field: 'minimum',
    headerName: 'Min Qty',
    width: 100,
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
    width: 90,
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

const Img = ({ params }) => {
  const myLoader = ({ width, quality }) => {
    return `${params.value}?w=${width}&q=${quality || 25}`
  }
  return (
    <Image
      loader={myLoader}
      src={`${params.value}`}
      alt="Picture"
      width={45}
      height={45}
      quality={100}
    />
  )
}

export default React.memo(function DataTable({ products, loading }) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const [open, setOpen] = React.useState(false)
  const [product, setProduct] = React.useState({})

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleDelete = (i) => mutate(i)

  const { refetch: productsRefetch } = useProductsByMerchantData(authToken)
  const { refetch: stockRefetch } = useStockByMerchantData(authToken, id)

  const { mutate } = useMutation((i) => deleteProduct(authToken, i), {
    onSuccess: () => {
      productsRefetch()
      stockRefetch()
    },
  })

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        disableColumnFilter
        disableDensitySelector
        density="comfortable"
        filterMode="client"
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress,
        }}
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
        rows={loading ? [] : products.products}
        columns={columns}
        pageSize={5}
        loading={loading}
        rowsPerPageOptions={[5]}
        disableVirtualization={true}
        onCellClick={(params) => {
          const { id } = params
          setProduct(params.row)
          if (params.field === 'edit') {
            handleOpen(id)
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
          timeout: 175,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditProductForm
              product={product}
              setProduct={setProduct}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
})
