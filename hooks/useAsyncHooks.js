// React Query
import { useQuery } from '@tanstack/react-query'

export async function fetchStockByMerchant(token, merchId) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({ merchantId: merchId }),
  }

  try {
    const res = await fetch('http://localhost:8000/api/merchants/stock', myInit)
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useStockByMerchantData(token, merchId) {
  return useQuery([`stockByMerchant`], () =>
    fetchStockByMerchant(token, merchId)
  )
}

export async function fetchProductsByMerchant(token) {
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
      `http://localhost:8000/api/merchants/list-products`,
      myInit
    )
    const data = await res.json()
    console.log('products by merchant', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}

export function useProductsByMerchantData(token) {
  return useQuery([`productsByMerchant`], () => fetchProductsByMerchant(token))
}

// PRODUCTS CRUD
export async function createProduct(token, newProduct) {
  let fd = new FormData()

  for (const [key, value] of Object.entries(newProduct)) {
    fd.append(key, value)
    console.log(key, value)
  }

  const myInit = {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    mode: 'cors',
    cache: 'default',
    body: fd,
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/create-product',
      myInit
    )

    const data = await res.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}

export async function deleteProduct(token, productId) {
  console.log('deleteProduct function')
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({ productId }),
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/delete-single-product',
      myInit
    )
    const data = await res.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}

export async function updateProduct(token, productToEdit) {
  let fd = new FormData()

  console.log('productToEdit', productToEdit)

  for (const [key, value] of Object.entries(productToEdit)) {
    console.log('key/value', key, value)
    fd.append(key, value)
  }

  const myInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: fd,
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/update-product',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// PRODUCTS CRUD

export async function fetchCustomersByMerchant(token) {
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
      'http://localhost:8000/api/merchants/customers',
      myInit
    )
    const data = await res.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('error', err)
  }
}

export function useCustomersByMerchant(token) {
  return useQuery([`customersByMerchant`], () =>
    fetchCustomersByMerchant(token)
  )
}

// CUSTOMERS CRUD
export async function createCustomer(token, newCustomer) {
  try {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCustomer),
      mode: 'cors',
      cache: 'default',
    }
    const res = await fetch(
      'http://localhost:8000/api/merchants/create-customer',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('error', err)
  }
}

export async function deleteCustomer(token, customerId) {
  console.log('customerId', customerId)
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ customerId }),
    mode: 'cors',
    cache: 'default',
  }
  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/delete-customer',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export async function updateCustomer(token, customerToEdit) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(customerToEdit),
  }

  try {
    const res = await fetch(
      `http://localhost:8000/api/merchants/update-customer`,
      myInit
    )

    if (!res.ok) {
      throw {
        error: new Error('something went wrong!'),
        status: res.status,
        body: await res.json(),
      }
    }

    const data = await res.json()

    return data
  } catch (err) {
    const { error, status, body } = err
    throw {
      error,
      status,
      body,
    }
  }
}
// CUSTOMERS CRUD
