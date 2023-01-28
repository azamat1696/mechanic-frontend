// import React from 'react'

// export default function Test() {
//   async function getTxt() {
//     const myInit = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       mode: 'no-cors',
//       cache: 'default',
//     }
//     try {
//       const res = await fetch(`http://localhost:8000/getfile`, myInit)
//       console.log('res', res)
//     } catch (err) {
//       console.log('err', err)
//     }
//   }

//   async function getPdf() {
//     const myInit = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       mode: 'no-cors',
//       cache: 'default',
//     }
//     try {
//       const res = await fetch(`http://localhost:8000/pdf`, myInit)
//       const myFile = await res.arrayBuffer()
//       console.log('myFile - Arraybuffer', myFile)
//       return { myFile }
//     } catch (err) {
//       return { err }
//     }
//   }

//   async function handleDownload() {
//     const { myFile, err } = await getPdf()

//     if (err) {
//       return err
//     }

//     const f = new File([myFile], `test.pdf`, { type: 'application/pdf' })

//     console.log('f', f)
//     const url = URL.createObjectURL(f)

//     let link = document.createElement('a')
//     link.href = url
//     link.download = f.name
//     link.target = '__blank'

//     document.body.appendChild(link)
//     link.click()
//     URL.revokeObjectURL(url)
//     link.remove()
//   }

//   return (
//     <div>
//       <button onClick={() => handleDownload()}>GetPdf</button>
//       <button onClick={() => getTxt()}>Get Txt</button>
//     </div>
//   )
// }
