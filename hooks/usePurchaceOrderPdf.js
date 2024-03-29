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
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/purchase-order`,
      myInit
    )
    const myFile = await res.arrayBuffer()
    return { myFile }
  } catch (err) {
    return { err }
  }
}

export function usePurchaseOrder(token, id) {
  return useQuery([`purchaseOrder`], () => getPdf(token, id))
}
