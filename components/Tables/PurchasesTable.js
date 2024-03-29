import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar, trTR } from '@mui/x-data-grid'

import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import LinearProgress from '@mui/material/LinearProgress'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

import EditPurchaseForm from '../forms/purchases/EditPurchaseForm'

// Hooks
import useAuthContext from '../../hooks/useAuthContext'
import { getPdf } from '../../hooks/usePurchaceOrderPdf'
import {
  deletePurchaseOrder,
  usePurchaseOrder,
} from '../../hooks/usePurchaseOrderHook'

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
    width: 95,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => <DownloadTwo params={params} />,
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
    headerAlign: 'center',
    align: 'right',
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: () => <DeleteBtn />,
    width: 90,
  },
]

// const DeleteBtn = ({ params }) => {
//   return (
//     <Button variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
//       Delete
//     </Button>
//   )
// }

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

const StatusChip = ({ params }) => {
  const { status } = params.row
  if (status === 'Pending') {
    return <Chip label="Pending" color="primary" variant="outlined" />
  } else if (status === 'Delivered') {
    return <Chip label="Delivered" color="success" variant="outlined" />
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/purchase-order`,
        myInit
      )
      const data = await res.json()
      console.log('data', data)
      formatData(data.items)
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
  const formatDate = (date) => new Date(date).toLocaleDateString()
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
            text: `Purchase Order - ${isObjectEmpty(order) ? 1 : order.id}`,
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
        text: `Date: ${isObjectEmpty(order) ? 1 : formatDate(order.createdAt)}`,
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
        fontSize: 35,
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

  const dwnldPdf = () => pdfMake.createPdf(docDef).open() //.download()

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

export default function PurchasesTable(
  {
    // purchaseOrdersData,
    // handlePurchaseSelection,
  }
) {
  const { state: authState, dispatch: authDispatch } = useAuthContext()
  const { authToken } = authState

  const [purchaseOrder, setPurchaseOrder] = React.useState({
    id: null,
    data: null,
  })

  function handlePurchaseSelection(params) {
    const { id } = params.row
    setPurchaseOrder({ id, data: params.row })
  }

  const {
    data: purchaseOrdersData,
    status: purchaseOrdersStatus,
    // error: purchaseOrdersError,
    // isStale: purchaseOrdersIsStale,
    // refetch: purchaseOrdersRefetch,
  } = usePurchaseOrder(authToken)

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [purchase, setPurchase] = React.useState(null)

  const handleEdit = (i, params) => {
    console.log('edit clicked', i)
    handleOpen()
    setPurchase(params.row)
  }

  const { mutate } = useMutation((i) => deletePurchaseOrder(authToken, i), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`ordersByMerchant`] })
      queryClient.invalidateQueries({ queryKey: [`stockByMerchant`] })
    },
  })

  const handleDelete = (i) => mutate(i)

  // React.useEffect(() => {
  //   if (purchaseOrdersData) {
  //     console.log('purchaseOrdersData', purchaseOrdersData.orders)
  //   }
  // }, [purchaseOrdersData])

  const [status, setStatus] = React.useState(false)

  React.useEffect(() => {
    if (purchaseOrdersStatus === 'loading') {
      setStatus(true)
    } else if (purchaseOrdersStatus === 'success') {
      setStatus(false)
    }
  }, [purchaseOrdersStatus])

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        rows={purchaseOrdersData !== undefined ? purchaseOrdersData.orders : []}
        columns={columns}
        pageSize={5}
        // disableColumnFilter
        density="comfortable"
        disableDensitySelector
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
        rowsPerPageOptions={[10]}
        rowHeight={40}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params) => {
          handlePurchaseSelection(params)
          const { id } = params
          console.log('Params', params.row)
          if (params.field === 'delete') {
            handleDelete(id)
          }
          if (params.field === 'edit') {
            handleEdit(id, params)
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
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <EditPurchaseForm
              purchase={purchase}
              open={open}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
