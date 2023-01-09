// React Query
import { useQuery } from '@tanstack/react-query'

// Delete Purchase Order Detail
export async function deletePurchaseOrderDetail(token, id) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
    mode: 'cors',
    cache: 'default',
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/delete-purchase-order-detail`,
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Delete Purchase Order Detail

// Update Purchase Order Detail
export async function updatePurchaseOrderDetail(token, updateProducts) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateProducts),
    mode: 'cors',
    cache: 'default',
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/update-purchase-order-detail`,
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useUpdatePurchaseOrderDetail(token, updateProducts) {
  return useQuery([`updatePurchaseOrderDetail`], () =>
    updateOrderDetail(token, updateProducts)
  )
}
// Update Purchase Order Detail
