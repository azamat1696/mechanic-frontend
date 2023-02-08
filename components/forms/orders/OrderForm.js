import React from 'react'
import OrderStepper from '../orders/stepper/OrderStepper'

export default function OrderForm({ handleClose }) {
  return (
    <div>
      <h1>Order Form</h1>
      <OrderStepper handleClose={handleClose} />
    </div>
  )
}
