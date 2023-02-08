import React from 'react'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

import useAuthContext from '../hooks/useAuthContext'
import { createProduct } from '../hooks/useImageUpload'
import { useMutation } from '@tanstack/react-query'

export default function Test() {
  const { state: authState } = useAuthContext()
  const { authToken } = authState

  const [image, setImage] = React.useState({
    image: '',
    name: '',
    supplierId: 18,
  })

  const { mutate } = useMutation(() => createProduct(authToken, image), {
    onSuccess: () => {
      console.log('success')
    },
  })

  React.useEffect(() => {
    console.log('image', image)
  }, [image])

  return (
    <Grid container sx={{ mt: 4, ml: 4 }}>
      <Grid item xs={6}>
        {/* <label style={labelStyles}>Image</label> */}
        <TextField
          id="outlined-basic"
          variant="outlined"
          autoComplete="off"
          size="small"
          disabled={true}
          sx={cursorStyle}
          value={image.name}
        />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{ ml: 1, ...cursorStyle }}
        >
          <input
            hidden
            type="file"
            name="image"
            onChange={(e) => {
              setImage({
                ...image,
                image: e.target.files[0],
                name: e.target.files[0].name,
              })
            }}
          />
          <PhotoCamera />
        </IconButton>
      </Grid>
      <Button onClick={() => mutate()}>Send</Button>
    </Grid>
  )
}

const labelStyles = {
  display: 'block',
  margin: '0 0 8.5px 3px',
  fontWeight: '500',
  color: '#202024',
  fontSize: '0.95rem',
}

const cursorStyle = {
  '.MuiOutlinedInput-input': {
    cursor: 'default',
  },
}
