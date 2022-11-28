import * as React from 'react'

// Material UI
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

// Icons
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import InventoryIcon from '@mui/icons-material/Inventory'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'

const active = {
  color: '#202024',
  ml: 2,
}

const inActive = {
  ml: 2,
  color: '#4d4d4da8',
}

const btnStyle = {
  p: 1,
}

export default function BasicList({ comp, setComp }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 250, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List
          sx={{
            p: 0,
            backgroundColor: '#fff',
            '& .MuiTypography-root': {
              fontWeight: 500,
              fontSize: '1.025rem',
              // letterSpacing: '0.025rem',
            },
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => setComp(e.target.outerText)}
              sx={btnStyle}
            >
              <ListItemText
                primary="Products"
                sx={comp === 'Products' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => setComp(e.target.outerText)}
              sx={btnStyle}
            >
              <ListItemText
                primary="Stock"
                sx={comp === 'Stock' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => setComp(e.target.outerText)}
              sx={btnStyle}
            >
              <ListItemText
                primary="Jobs"
                sx={comp === 'Jobs' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => setComp(e.target.outerText)}
              sx={btnStyle}
            >
              <ListItemText
                primary="Purchases"
                sx={comp === 'Purchases' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => setComp(e.target.outerText)}
              sx={btnStyle}
            >
              <ListItemText
                primary="Customers"
                sx={comp === 'Customers' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disableRipple={true}
              onClick={(e) => {
                console.log('e', e.target.outerText)
                setComp(e.target.outerText)
              }}
              sx={btnStyle}
            >
              <ListItemText
                primary="Suppliers"
                sx={comp === 'Suppliers' ? active : inActive}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  )
}
