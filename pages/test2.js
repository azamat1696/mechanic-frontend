// import React from 'react'
// import pdfmake from 'pdfmake/build/pdfmake'
// import pdfFonts from 'pdfmake/build/vfs_fonts'

// // Hooks
// import useAuthContext from '../hooks/useAuthContext'

// pdfMake.vfs = pdfFonts.pdfMake.vfs

// export default function Test() {
//   const { state: authState } = useAuthContext()
//   const { authToken } = authState

//   const [order, setOrder] = React.useState([])

//   async function fetchOrderDetail(authToken, id) {
//     const myInit = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${authToken}`,
//       },
//       mode: 'cors',
//       cache: 'default',
//       body: JSON.stringify({ orderId: id }),
//     }
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/invoice`,
//         myInit
//       )
//       const data = await res.json()
//       console.log('data', data)
//       formatData(data.orderDetail)
//       return data
//     } catch (err) {
//       return err
//     }
//   }

//   function formatData(data) {
//     const arrData = data.map((d) => {
//       const product = {
//         Name: d.product.name,
//         Quantity: d.quantity,
//         Price: d.price,
//         Total: d.quantity * d.price,
//       }
//       return product
//     })
//     setOrder(arrData)
//   }

//   const columns = ['Name', 'Quantity', 'Price', 'Total']

//   function buildTableBody(data, columns) {
//     const body = []
//     body.push(columns)

//     data.forEach(function (row) {
//       const dataRow = []
//       columns.forEach(function (column) {
//         dataRow.push(row[column].toString())
//       })
//       body.push(dataRow)
//     })

//     return body
//   }

//   function table(data, columns) {
//     return {
//       headerRows: 1,
//       widths: [125, 65, 65, 65],
//       body: buildTableBody(data, columns),
//     }
//   }

//   let docDef = {
//     content: [
//       {
//         columns: [
//           {
//             width: '65%',
//             text: 'Invoice',
//             style: 'header',
//             margin: [0, 2, 10, 20],
//           },
//           {
//             width: '35%',
//             stack: ['Address A', 'Address B', 'Address C'],
//             fontSize: 12,
//             style: 'align',
//           },
//         ],
//       },
//       { table: table(order, columns), style: 'table' },
//     ],
//     styles: {
//       header: {
//         fontSize: 40,
//         bold: true,
//       },
//       table: {
//         fontSize: 12,
//       },
//       align: {
//         alignment: 'right',
//       },
//     },
//   }

//   const dwnldPdf = () => pdfMake.createPdf(docDef).open()

//   React.useEffect(() => {
//     console.log('order', order)
//     if (order.length !== 0) {
//       dwnldPdf()
//     }
//   }, [order])

//   return (
//     <div style={divStyle}>
//       <button
//         style={btnStyle}
//         onClick={() => {
//           setOrder([])
//           fetchOrderDetail(authToken, 220)
//         }}
//       >
//         220
//       </button>
//       <button
//         style={btnStyle}
//         onClick={() => {
//           setOrder([])
//           fetchOrderDetail(authToken, 226)
//         }}
//       >
//         226
//       </button>

//       <button onClick={dwnldPdf} style={btnStyle}>
//         Open Pdf
//       </button>
//     </div>
//   )
// }

// const divStyle = {
//   margin: '30px 0 0 30px',
//   display: 'flex',
//   flexDirection: 'column',
//   width: '200px',
//   height: '100px',
// }

// const btnStyle = {
//   margin: '10px 0 0 0',
// }
