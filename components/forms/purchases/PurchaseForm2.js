import React from 'react'
import PurchaseStepper from './stepper/PurchaseStepper'

export default function PurchaseForm2({ handleClose }) {
  return (
    <div>
      <h1>Purchase Form 2</h1>
      <PurchaseStepper handleClose={handleClose} />
    </div>
  )
}
