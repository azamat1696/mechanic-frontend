// React Query
import { useQuery } from '@tanstack/react-query'

export async function updateMerchDetails(token, updatedMerchDetails) {
  const myInit = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(updatedMerchDetails),
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/update-merchant`,
      myInit
    )
    const data = await res.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('err', err)
    return err
  }
}
