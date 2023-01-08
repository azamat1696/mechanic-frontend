// React Query
import { useQuery } from '@tanstack/react-query'

// Fetch Orders Data
export async function fetchOrderDetailByOrder(token, id) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({ orderId: id }),
  }
  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/order-detail',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useOrderDetailsData(token, id) {
  return useQuery(
    [`orderDetailByOrder`],
    () => fetchOrderDetailByOrder(token, id),
    {
      cacheTime: 0,
    }
  )
}
// Fetch Orders Data

// Delete OrderDetail
export async function deleteOrderDetail(token, id) {
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
      'http://localhost:8000/api/merchants/delete-order-detail',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Delete OrderDetail

// Update Order Detail
export async function updateOrderDetail(token, updateProducts) {
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
      'http://localhost:8000/api/merchants/update-order-detail',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useUpdateOrderDetail(token, updateProducts) {
  return useQuery([`updateOrderDetail`], () =>
    updateOrderDetail(token, updateProducts)
  )
}
// Update Order Detail
