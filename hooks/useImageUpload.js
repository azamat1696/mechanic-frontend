import { useQuery } from '@tanstack/react-query'

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/merchants/create-product`,
      myInit
    )

    const data = await res.json()
    console.log('data', data)
    return data
  } catch (err) {
    console.log('err', err)
  }
}
