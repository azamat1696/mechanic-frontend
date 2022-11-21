// React Query
import { useQuery } from '@tanstack/react-query'

// Fetch Orders Data

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
      'http://localhost:8000/api/merchants/view-orders',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useOrders(token) {
  return useQuery([`customerOrdersByMerchant`], () =>
    fetchOrdersByMerchant(token)
  )
}

// Fetch Orders Data
