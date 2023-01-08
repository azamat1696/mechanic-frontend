// React Query
import { useQuery } from '@tanstack/react-query'

// Create Purchase Order
export async function createPurchaseOrder(token, purchaseOrder) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(purchaseOrder),
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/create-purchase-order',
      myInit
    )
    const data = await res.json()
    console.log('PO Created Response', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}
// Create Purchase Order

// Get Purchase Order Data
export async function fetchOrdersByMerchant(token) {
  const myInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
  }
  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/merchant-orders',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function usePurchaseOrder(token) {
  return useQuery([`ordersByMerchant`], () => fetchOrdersByMerchant(token))
}
// Get Purchase Order Data

export async function deletePurchaseOrder(token, id) {
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
      'http://localhost:8000/api/merchants/delete-purchase-order',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
