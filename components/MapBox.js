import React from 'react'
import Map from 'react-map-gl'
import Card from '@mui/material/Card'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapBox() {
  const [viewState, setViewState] = React.useState({
    longitude: 33.354,
    latitude: 35.201,
    zoom: 13,
  })

  return (
    <Card sx={{ width: 'max-content', margin: '50px auto 0 auto' }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: 1600, height: 800 }}
        mapStyle="mapbox://styles/hal87/clcdex4e0002u14p28rovt790"
        mapboxAccessToken={process.env.mapbox_key}
      />
    </Card>
  )
}
