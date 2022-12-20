import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'

// Hooks
import useAuthContext from '../../hooks/useAuthContext'
import { getPdf } from '../../hooks/usePurchaceOrderPdf'
import {
  deletePurchaseOrder,
  usePurchaseOrder,
} from '../../hooks/usePurchaseOrderHook'

// React Query
import { useMutation } from '@tanstack/react-query'

const columns = [
  {
    field: 'id',
    headerName: 'Order Num',
    width: 150,
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
    width: 110,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <Download params={params} />,
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
]

const DeleteBtn = ({ params }) => {
  return (
    <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
      Delete
    </Button>
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
  const {
    authToken,
    merchantDetails: { id },
  } = authState

  const {
    data,
    status: purchaseStatus,
    error: purchaseError,
    isStale: purchaseIsStale,
    refetch: purchaseRefetch,
  } = usePurchaseOrder(authToken)

  const { mutate } = useMutation((i) => deletePurchaseOrder(authToken, i), {
    onSuccess: () => {
      purchaseRefetch()
    },
  })

  const handleDelete = (i) => mutate(i)

  return (
    <Box sx={{ height: 600, width: '100%' }}>
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
        }}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          handlePurchaseSelection(params)
          if (params.field === 'delete') {
            handleDelete(params.id)
          }
        }}
      />
    </Box>
  )
}
