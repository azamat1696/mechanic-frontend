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
  useFindProduct,
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

// Context
export const EditProductContext = React.createContext()

export function EditProductProvider({ children }) {
  const [open, setOpen] = React.useState(false)
  const [idx, setIdx] = React.useState(null)

  const handleOpen = (i) => {
    setIdx(i)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    refetch()
  }

  const { state: authState, dispatch: authDispatch } = useAuthContext()

  const { data, refetch } = useFindProduct(
    authState.authToken,
    idx,
    'findProduct'
  )

  const exportProps = {
    handleOpen,
    handleClose,
    data,
    open,
    idx,
    setIdx,
  }

  React.useEffect(() => {
    refetch()
  }, [idx])

  return (
    <EditProductContext.Provider value={exportProps}>
      {children}
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
            <EditProductForm data={data} idx={idx} handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>
    </EditProductContext.Provider>
  )
}
// Context

const MatDel = ({ index }) => {
  const { state: authState, dispatch: authDispatch } = useAuthContext()

  const { refetch: productsRefetch, isStale: productsIsStale } =
    useProductsByMerchantData(authState.authToken, 'productsByMerchant')
  const { refetch: stockRefetch, isStale: stockIsStale } =
    useStockByMerchantData(
      authState.authToken,
      authState.merchantDetails.id,
      'stockByMerchant'
    )

  const { mutate } = useMutation(
    () => deleteProduct(authState.authToken, index),
    {
      onSuccess: () => {
        productsIsStale && productsRefetch()
        stockIsStale && stockRefetch()
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
        >
          <DeleteIcon color={'error'} />
        </IconButton>
      }
    />
  )
}

const MatEdit = ({ index }) => {
  const { handleOpen } = React.useContext(EditProductContext)
  // console.log('index', index)
  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          onClick={() => handleOpen(index)}
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
    field: 'image',
    headerName: 'Image',
    width: 150,
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
    width: 150,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'product_code',
    headerName: 'Product code',
    width: 150,
    editable: false,
    sortable: false,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    width: 150,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'supplierName',
    headerName: 'Supplier Name',
    width: 150,
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
  // useRenderCount('EditBtn PT')
  return (
    <div style={{ cursor: 'pointer' }}>
      <MatEdit index={params.row.id} />
    </div>
  )
}

const DeleteBtn = ({ params }) => {
  // useRenderCount('DeleteBtn PT')
  return (
    <div style={{ cursor: 'pointer' }}>
      <MatDel index={params.row.id} />
    </div>
  )
}

const Img = ({ params }) => {
  // useRenderCount('Img PT')

  // Custom Image Loader
  const myLoader = ({ width, quality }) => {
    return `${params.value}?w=${width}&q=${quality || 25}`
  }
  // Custom Image Loader

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
  useRenderCount('ProductsTable')
  return (
    <Box sx={{ height: '500px' }}>
      <EditProductProvider>
        <DataGrid
          // disableColumnFilter
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
        />
      </EditProductProvider>
    </Box>
  )
})
