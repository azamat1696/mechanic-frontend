import * as React from 'react'
import Link from 'next/link'

// Material UI
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import AdbIcon from '@mui/icons-material/Adb'
import Tooltip from '@mui/material/Tooltip'

// Components
import LoginModal from '../components/LoginModal'

// Hooks
import useAuthContext from '../hooks/useAuthContext'

const pages = ['']
const settings = ['Account']

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const { state: authState } = useAuthContext()
  const { id } = authState.merchantDetails

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget)
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
  const handleCloseNavMenu = () => setAnchorElNav(null)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  return (
    <AppBar position="static" sx={{ backgroundColor: '#444d56' }}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="a" href="/" sx={mobTitle}>
            Mechanic
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(
                (page) =>
                  authState.authToken && (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  )
              )}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography variant="h5" noWrap component="a" href="" sx={deskTitle}>
            Mechanic
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(
              (page) =>
                authState.authToken && (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    <Link href={`/${page}`} passHref>
                      <a>{page}</a>
                    </Link>
                  </Button>
                )
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              backgroundColor: 'transparent',
              display: 'flex',
            }}
          >
            <LoginModal />
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography
                  variant="body1"
                  noWrap
                  component="p"
                  href=""
                  sx={{ color: '#fff' }}
                >
                  {id}
                </Typography>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default React.memo(ResponsiveAppBar)

const mobTitle = {
  mr: 2,
  display: { xs: 'none', md: 'flex' },
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.2rem',
  color: 'inherit',
  textDecoration: 'none',
  textTransform: 'uppercase',
}

const deskTitle = {
  mr: 2,
  display: { xs: 'flex', md: 'none' },
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
  textTransform: 'uppercase',
}
