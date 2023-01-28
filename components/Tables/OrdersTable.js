import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

// Components
import EditOrderForm from '../forms/orders/EditOrderForm'

// Material UI
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import DownloadIcon from '@mui/icons-material/Download'

// Hooks
import {
  deleteCustomerOrder,
  useCustomerOrders,
} from '../../hooks/useOrdersHook'
import { useStockByMerchantData } from '../../hooks/useAsyncHooks'
import useAuthContext from '../../hooks/useAuthContext'
import { getPdf } from '../../hooks/useInvoicePdf'

// React Query
import { useMutation } from '@tanstack/react-query'

import { queryClient } from '../../pages/_app'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

const fontStyle = {
  fontFamily: "'Karla', sans-serif;",
  fontWeight: 400,
  fontSize: '0.92rem',
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
    width: 125,
    editable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 100,
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
    width: 110,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params) => {
      const order = params.row.orderDetail
      const ttlsArr = order.map((o) => o.quantity * o.price)
      let totalOrderRtl
      ttlsArr.length > 0
        ? (totalOrderRtl = ttlsArr.reduce((acc, cv) => acc + cv))
        : (totalOrderRtl = 0)
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
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <StatusChip params={params} />,
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
  {
    field: 'downloadPdf',
    headerName: 'Download',
    sortable: false,
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <DownloadTwo params={params} />,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    headerAlign: 'center',
    align: 'right',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <MatDel />,
    width: 100,
  },
]

const MatDel = ({ index }) => {
  return (
    <FormControlLabel
      control={
        <IconButton
          aria-label="add an alarm"
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
  return (
    <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
      Delete
    </Button>
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
  const { state: authState } = useAuthContext()
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

function DownloadTwo({ params }) {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const [order, setOrder] = React.useState({})
  const [orderDetail, setOrderDetail] = React.useState([])
  // const [totalValue, setTotalValue] = React.useState('')

  const columns = ['Name', 'Quantity', 'Price', 'Total']

  async function fetchOrderDetail(authToken, id) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({ orderId: id }),
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/invoice`,
        myInit
      )
      const data = await res.json()
      console.log('data', data)
      formatData(data.orderDetail)
      setOrder(data.order)
      return data
    } catch (err) {
      return err
    }
  }

  function formatData(data) {
    const arrData = data.map((d) => {
      const product = {
        Name: d.product.name,
        Quantity: d.quantity,
        Price: d.price,
        Total: d.quantity * d.price,
      }
      return product
    })
    setOrderDetail(arrData)
  }

  function buildTableBody(data, columns) {
    const body = []
    body.push(columns)

    data.forEach(function (row) {
      const dataRow = []
      columns.forEach(function (column) {
        dataRow.push(row[column].toString())
      })
      body.push(dataRow)
    })

    return body
  }

  function table(data, columns) {
    return {
      headerRows: 1,
      widths: [125, 65, 65, 65],
      body: buildTableBody(data, columns),
    }
  }

  const isObjectEmpty = (objectName) => Object.keys(objectName).length === 0
  // const formatDate = (date) => new Date(date).toLocaleDateString()

  const totalValue = (arr) => {
    const values = arr.map((a) => a.Total)
    return values.length > 0 ? values.reduce((acc, curr) => acc + curr) : 0
  }

  let docDef = {
    content: [
      {
        columns: [
          {
            width: '65%',
            text: `Invoice - ${isObjectEmpty(order) ? 1 : order.id}`,
            style: 'header',
            margin: [0, 2, 10, 20],
          },
          {
            width: '35%',
            stack: ['Address A', 'Address B', 'Address C'],
            fontSize: 12,
            style: 'align',
          },
        ],
      },
      {
        text: `Date: ${isObjectEmpty(order) ? 1 : order.createdAt}`,
        margin: [0, 2, 10, 20],
      },
      { table: table(orderDetail, columns), style: 'table' },
      {
        table: {
          headerRows: 1,
          widths: [125, 65, 65, 65],
          body: [['Total', '', '', `${totalValue(orderDetail)}`]],
        },
        style: 'tableTwo',
      },
    ],
    // Styles
    styles: {
      header: {
        fontSize: 40,
        bold: true,
      },
      table: {
        fontSize: 12,
      },
      tableTwo: {
        fontSize: 12,
        margin: [0, 7.5, 0, 0],
        bold: true,
      },
      align: {
        alignment: 'right',
      },
    },
  }

  function dwnldPdf() {
    return pdfMake.createPdf(docDef, null).download(`Invoice - ${order.id}`)
  }

  React.useEffect(() => {
    console.log('orderDetail', orderDetail)
    if (orderDetail.length !== 0) {
      dwnldPdf()
    }
  }, [orderDetail])

  return (
    <IconButton
      aria-label="delete"
      size="large"
      color="primary"
      onClick={() => {
        setOrderDetail([])
        fetchOrderDetail(authToken, params.row.id)
      }}
      sx={{ '&:hover': { backgroundColor: 'transparent' } }}
    >
      <DownloadIcon fontSize="inherit" />
    </IconButton>
  )
}

export default React.memo(function OrdersTable({ ordersData }) {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [order, setOrder] = React.useState(null)

  const { mutate } = useMutation((i) => deleteCustomerOrder(authToken, i), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`customerOrdersByMerchant`],
      })
      queryClient.invalidateQueries({
        queryKey: [`stockByMerchant`],
      })
    },
  })

  const handleDelete = (i) => mutate(i)

  const handleEdit = (i, params) => {
    console.log('edit clicked', i)
    handleOpen()
    setOrder(params.row)
  }

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={ordersData.foundOrders}
        columns={columns}
        pageSize={5}
        density="comfortable"
        disableColumnFilter
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
          '.MuiDataGrid-cell:focus': {
            outline: 'none !important',
          },
          ...fontStyle,
        }}
        rowsPerPageOptions={[5]}
        rowHeight={42}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          const { id } = params
          console.log('Params', params.row)
          if (params.field === 'edit') {
            handleEdit(id, params)
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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditOrderForm
              order={order}
              open={open}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
})
