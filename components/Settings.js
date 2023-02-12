import React from 'react'

// MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings'

// Modal
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'

//Comp
import { Settings } from '../components/forms/merchant-settings/Settings'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  //   height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export function SettingsButton() {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  return (
    <div>
      <Button
        xs={1.5}
        sx={{
          mb: 1,
          width: '100%',
          backgroundColor: '#708faf',
          '&:hover': {
            backgroundColor: '#708faf',
          },
          color: '#fff',
          p: 1,
        }}
        variant="contained"
        endIcon={<SettingsIcon />}
        onClick={handleOpen}
      >
        Settings
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {/* Settings form component */}
            <Settings />
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
