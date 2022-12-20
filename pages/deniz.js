import React from 'react'
import Button from '@mui/material/Button'

export default function Deniz() {
  const [count, setCount] = React.useState(0)

  function handleClick() {
    console.log('Clicked!')
    setCount(count + 1)
  }
  return (
    <Button
      variant="outlined"
      style={{ backgroundColor: 'red' }}
      onClick={handleClick}
    >
      Deniz clicked {count} times
    </Button>
  )
}
