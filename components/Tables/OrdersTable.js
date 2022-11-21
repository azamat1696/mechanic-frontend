import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

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
    width: 150,
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
    width: 150,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      const order = params.row.orderDetail
      const ttlsArr = order.map((o) => o.quantity * o.price)
      const totalOrderRtl = ttlsArr.reduce((acc, cv) => acc + cv)
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
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <StatusChip params={params} />,
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
  // useRenderCount('DeleteBtn PT')
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
      }}
    >
      View
    </Button>
    // <div style={{ cursor: 'pointer' }}>
    //   <MatDel index={params.row.id} />
    // </div>
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

export default function OrdersTable({ ordersData, authToken }) {
  React.useEffect(() => {
    console.log('ordersData', ordersData)
  }, [ordersData])
  return (
    <Box sx={{ height: 425, width: '100%' }}>
      <DataGrid
        rows={ordersData.foundOrders}
        columns={columns}
        pageSize={5}
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
        }}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  )
}
