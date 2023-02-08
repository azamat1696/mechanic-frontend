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
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/view-orders`,
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useCustomerOrders(token) {
  return useQuery([`customerOrdersByMerchant`], () =>
    fetchOrdersByMerchant(token)
  )
}
// Fetch Orders Data

export async function createCustomerOrder(token, data) {
  console.log('async create customer triggered')
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data),
    // body: JSON.stringify({
    //   customerId: customer,
    //   products: products.products,
    //   description: 'Service',
    //   name: 'test',
    // }),
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/create-order`,
      myInit
    )
    const data = await res.json()
    console.log('Order Created Response', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}

export async function deleteCustomerOrder(token, id) {
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/delete-order`,
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
