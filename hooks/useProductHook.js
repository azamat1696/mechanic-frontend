import React from 'react'

export function UseProductHook(purchase) {
  const [products, setProducts] = React.useState([])

  React.useEffect(() => {
    console.log('purchaseDetail', purchaseDetail)
    const { purchaseDetail } = purchase
    if (purchaseDetail) {
      setProducts(purchaseDetail)
    }
  }, [purchase])

  return {
    products,
    setProducts,
  }
}
