// React Query
import { useQuery } from '@tanstack/react-query'

export async function getPdf(authToken, id) {
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
    // const myFile = await res.arrayBuffer()
    const data = await res.json()
    return data
    // return { data }
  } catch (err) {
    return err
    // return { err }
  }
}

export function useInvoice(token, id) {
  return useQuery([`invoice`], () => getPdf(token, id))
}

export async function fetchOrderDetail(authToken, id) {
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
    return await res.json()
  } catch (err) {
    return err
  }
}
