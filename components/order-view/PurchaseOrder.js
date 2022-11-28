import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

export default function PurchaseOrder({
  purchaseOrderData,
  purchaseOrder,
  acc,
}) {
  React.useEffect(() => {
    console.log('purchaseOrder', purchaseOrder)
  }, [purchaseOrder])
  return (
    <div>
      <Accordion disabled={acc}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Purchase Order {purchaseOrder.id && purchaseOrder.id}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {purchaseOrder.id && purchaseOrder.data.supplier.name}
          </Typography>
          <Typography>
            {purchaseOrder.id &&
              purchaseOrder.data.purchaseDetail.map((item, i) => {
                return <div key={i}>{item.quantity}</div>
              })}
          </Typography>
          <Button variant="outlined">Pdf</Button>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
