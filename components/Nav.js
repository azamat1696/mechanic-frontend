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

import { useTheme } from '@mui/material/styles'

// Components
import LoginModal from '../components/LoginModal'
import Switch from '../components/Switch'

// Hooks
import useAuthContext from '../hooks/useAuthContext'
import useThemeContext from '../hooks/useThemeContext'

const pages = [
  /*'test'*/
]
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const ResponsiveAppBar = ({ token, setToken, login, setLogin, userLogin }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const { state: authState, dispatch: authDispatch } = useAuthContext()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const { theme, setTheme } = useThemeContext()

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme === true ? '#3c5f83' : '#444d56',
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
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
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
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
          <Box sx={{ flexGrow: 0, ml: 5 }}>
            <Switch theme={theme} setTheme={setTheme} />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <LoginModal
              login={login}
              setLogin={setLogin}
              userLogin={userLogin}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default React.memo(ResponsiveAppBar)
