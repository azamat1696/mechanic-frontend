import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Google Maps API
import {
  GoogleMap,
  useLoadScript,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api'

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  ></Box>
)

const containerStyle = {
  width: '1500px',
  height: '850px',
  margin: '0 auto',
}

export default function BasicCard() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_KEY,
  })

  React.useEffect(() => {
    console.log('IsLoaded', isLoaded)
  }, [isLoaded])

  return (
    isLoaded && (
      <Card sx={{ minWidth: 275, maxWidth: 1500, margin: '50px auto 0 auto' }}>
        <Map />
      </Card>
    )
  )
}

function Map() {
  return (
    <GoogleMap
      zoom={12}
      center={{ lat: 35.183204252095365, lng: 33.35870314605175 }}
      mapContainerStyle={containerStyle}
    >
      <Marker
        position={{
          lat: 35.18362264334021,
          lng: 33.3568829544815,
        }}
      />
    </GoogleMap>
  )
}
