import { AppBar, Badge, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React, { useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import AuthService from '../../services/auth-service';
import { NavContainer, useStyles } from './Layout.style';

const Layout: React.FC = ({ children }) => {

  const history = useHistory();

  if (!AuthService.isLoggedIn) {
    history.push("/login");
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const { accountName } = useParams<any>();

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (event: any) => {
    AuthService.logout();
    history.push("/");
  };

  const constructNavlink = (value: string): string => {    
    value = value.replace('id', accountName);
    return value;
  };

  const drawerItems = () => (
    <Box
      role='presentation'
      onClick={() => setIsDrawerOpen(false)}
      onKeyDown={() => setIsDrawerOpen(false)}
      className={classes.drawerItemsBox}
    >
      <NavContainer>
        <NavLink
          exact
          to='/'
          activeStyle={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          <div>Home</div>
        </NavLink>
        <NavLink
          exact
          to='/accounts'
          activeStyle={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          <div>Sync Account</div>
        </NavLink>
        <NavLink
          to={constructNavlink('/accounts/id/details')}
          activeStyle={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          <div>Client Portal</div>
        </NavLink>
        <NavLink
          to={constructNavlink('/accounts/id/trader-portal')}
          activeStyle={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          <div>Trader Portal</div>
        </NavLink>
        <NavLink
          to={constructNavlink('/accounts/id/overview')}
          activeStyle={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          <div>Trades</div>
        </NavLink>
        <NavLink
          onClick={handleLogout}
          to="#">
          <div>Log out</div>
        </NavLink>
      </NavContainer>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' color='primary'>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <div className={classes.drawer}>{drawerItems()}</div>
          </Drawer>
          <div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
            >
              <AccountCircle />
              <div className={classes.account}>{AuthService.currentUser.displayName}</div>
            </IconButton>
            <IconButton aria-label='show 1 new notification'>
              <Badge badgeContent={1} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.children}>{children}</div>
    </Box>
  );
};

export default Layout;
