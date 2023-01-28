import * as React from 'react'
import Image from 'next/image'

// Material UI
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Chip from '@mui/material/Chip'

const fontStyle = {
  fontFamily: "'Karla', sans-serif;",
  fontWeight: 400,
  fontSize: '0.9rem',
}

const columns = [
  {
    field: 'productId',
    headerName: 'ID',
    width: 90,
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
    hide: false,
    editable: false,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
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
    },
  },
  {
    field: 'name',
    headerName: 'Product name',
    width: 150,
    hide: false,
    editable: false,
    sortable: true,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'product_code',
    headerName: 'Product code',
    width: 140,
    hide: false,
    editable: false,
    sortable: false,
    filterable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'min',
    headerName: 'Min Qty',
    width: 100,
    editable: false,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'Reciepts',
    headerName: 'Reciepts',
    type: 'number',
    width: 100,
    hide: false,
    editable: false,
    sortable: true,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'sales',
    headerName: 'Sales',
    hide: false,
    editable: false,
    sortable: true,
    filterable: false,
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'inStock',
    headerName: 'InStock',
    hide: false,
    editable: false,
    sortable: true,
    filterable: false,
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'stockLevel',
    headerName: 'Level',
    hide: false,
    editable: false,
    sortable: false,
    filterable: true,
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <MinChip params={params} />,
  },
]

const MinChip = ({ params }) => {
  const { min, inStock } = params.row
  if (inStock <= min) {
    return <Chip label="Low" color="error" variant="outlined" />
  } else {
    return <Chip label="Ok" color="success" variant="outlined" />
  }
}

export default React.memo(function DataTable({ stock, stockLoading }) {
  return (
    <Box sx={{ height: '500px' }}>
      <DataGrid
        rows={stock}
        getRowId={(row) => row.productId}
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
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rowHeight={47.5}
        loading={stockLoading}
      />
    </Box>
  )
})
