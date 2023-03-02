import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';
import { logout } from '../config/firebase';

interface Props {
  active: string;
}

function ListItems({ active }: Props) {
  return (
    <>
      <ListItemButton
        component={RouterLink}
        to="/dashboard"
        selected={active === 'Dashboard'}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        component={RouterLink}
        to="/profile"
        selected={active === 'Profile'}
      >
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );
}

export default ListItems;
