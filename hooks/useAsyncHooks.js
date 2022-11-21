// React Query
import { useQuery } from '@tanstack/react-query'

// fetchStockByMerchant
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

export function useStockByMerchantData(token, merchId, name) {
  return useQuery([`${name}`], () => fetchStockByMerchant(token, merchId))
}
// fetchStockByMerchant

// fetchpProductsByMerchant
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
      'http://localhost:8000/api/merchants/list-products',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useProductsByMerchantData(token, name) {
  return useQuery([`${name}`], () => fetchProductsByMerchant(token))
}
// fetchpProductsByMerchant

// Create New Product
export async function createNewProduct(token, newProduct) {
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

    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Create New Product

// Delete single product
export async function deleteProduct(token, productId) {
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
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Delete single product

// Update Products
export async function fetchSingleProduct(token, productId) {
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
      'http://localhost:8000/api/merchants/product',
      myInit
    )
    const data = await res.json()
    return data
  } catch (err) {
    console.log('err', err)
  }
}

export async function updateSingleProduct(token, productToEdit) {
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

export function useFindProduct(token, productId, name) {
  return useQuery([`${name}`], () => fetchSingleProduct(token, productId))
}

export function useUpdateProduct(token, productId, name) {
  return useQuery([`${name}`], () =>
    updateSingleProduct(token, productId, name, manufacturer)
  )
}
// Update Products

// Fetch Customers By Merchant
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
    return await res.json()
  } catch (err) {
    console.log('error', err)
  }
}

export function useCustomersByMerchant(token, name) {
  return useQuery([`name`], () => fetchCustomersByMerchant(token))
}
// Fetch Customers By Merchant

// Create new customer
export async function createNewCustomer(token, newCustomer) {
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
// Create new customer

// Delete Customer
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
// Delete Customer

// Update Customer
export async function updateSingleCustomer(token, customerToEdit) {
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
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useFindCustomer(token, customerId) {
  console.log('called!')
  return useQuery([`findCustomer`], () =>
    fetchSingleCustomer(token, customerId)
  )
}
// Update Customer
