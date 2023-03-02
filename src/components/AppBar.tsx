import React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Toolbar, Typography, IconButton } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Menu as MenuIcon } from '@mui/icons-material';

const drawerWidth: number = 240;

interface Props {
  title: string;
  displayName: string;
  photoURL: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBar({
  title,
  displayName,
  photoURL,
  open,
  setOpen,
}: Props) {
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledAppBar
      position="absolute"
      open={open}
    >
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        <Avatar
          src={photoURL}
          alt={displayName}
        />
      </Toolbar>
    </StyledAppBar>
  );
}
