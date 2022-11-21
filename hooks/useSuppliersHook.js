// React Query
import { useQuery } from '@tanstack/react-query'

// Get Supplier Data
export async function fetchSuppliersByMerchant(token) {
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
      'http://localhost:8000/api/merchants/suppliers',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useSuppliersByMerchant(token) {
  return useQuery([`suppliersByMerchant`], () =>
    fetchSuppliersByMerchant(token)
  )
}
// Get Supplier Data

export async function fetchProductsBySupplier(token, newOrder) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(newOrder),
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/products-supplier',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}

export function useProductsBySupplier(token, supplierId) {
  return useQuery([`productsBySupplier`], () =>
    fetchProductsBySupplier(token, supplierId)
  )
}

// Create Supplier Data
export async function createSupplierByMerchant(token, newSupplier) {
  console.log('newSupplier', newSupplier)
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(newSupplier),
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/create-supplier',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Create Supplier Data

// Delete Supplier
export async function deleteSupplier(token, supplierId) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify({ supplierId }),
  }

  try {
    const res = await fetch(
      'http://localhost:8000/api/merchants/delete-supplier',
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Delete Supplier

// Edit Supplier
export async function updateSupplier(token, supplierToEdit) {
  const myInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(supplierToEdit),
  }

  try {
    const res = await fetch(
      `http://localhost:8000/api/merchants/update-supplier`,
      myInit
    )
    return await res.json()
  } catch (err) {
    console.log('err', err)
  }
}
// Edit Supplier
